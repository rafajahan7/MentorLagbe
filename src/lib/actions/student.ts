
"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { apiRequest } from "@/lib/api";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export async function getStudentDashboardStats() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "student") {
      return {
        success: false,
        stats: null,
      };
    }

    const studentEmail = session.user.email;

    const [
      totalApplied,
      acceptedApplications,
      pendingApplications,
      user,
    ] = await Promise.all([
      db.collection("applications").countDocuments({
        studentEmail,
      }),

      db.collection("applications").countDocuments({
        studentEmail,
        status: "accepted",
      }),

      db.collection("applications").countDocuments({
        studentEmail,
        status: "pending",
      }),

      db.collection("users").findOne(
        { email: studentEmail },
        { projection: { plan: 1 } }
      ),
    ]);

    return {
      success: true,
      stats: {
        totalApplied,
        acceptedApplications,
        pendingApplications,
        currentPlan: user?.plan === "pro" ? "Pro" : "Free",
      },
    };
  } catch (error) {
    console.error("Student dashboard stats error:", error);

    return {
      success: false,
      stats: null,
    };
  }
}

export async function getMyApplications() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "student") {
      return [];
    }

    const studentEmail = session.user.email;

    const applications = await db
      .collection("applications")
      .find({ studentEmail })
      .sort({ appliedAt: -1 })
      .toArray();

    const formattedApplications = await Promise.all(
      applications.map(async (application) => {
        let tuition = null;

        if (
          application.tuitionId &&
          ObjectId.isValid(application.tuitionId)
        ) {
          tuition = await db.collection("tuitions").findOne({
            _id: new ObjectId(application.tuitionId),
          });
        }

        const tutor = await db.collection("users").findOne(
          { email: application.tutorEmail },
          { projection: { name: 1 } }
        );

        const appliedAt = application.appliedAt
          ? new Date(application.appliedAt)
          : null;

        return {
          _id: application._id.toString(),
          tuitionTitle: application.tuitionTitle || "Untitled Tuition",
          tutorName:
            application.tutorName ||
            tuition?.tutorName ||
            tutor?.name ||
            "Unknown Tutor",
          tutorEmail: application.tutorEmail || "Not available",
          monthlyFee: Number(application.monthlyFee) || 0,
          appliedAt:
            appliedAt && !Number.isNaN(appliedAt.getTime())
              ? appliedAt.toISOString()
              : new Date().toISOString(),
          status: application.status || "pending",
        };
      })
    );

    return formattedApplications;
  } catch (error) {
    console.error("Get student applications error:", error);
    return [];
  }
}

export async function cancelApplication(applicationId: string) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== "student") {
      return {
        success: false,
        message: "Authentication required. Please sign in.",
      };
    }

    const { token} = await auth.api.getToken({
      headers: requestHeaders,
    });

    if ( !token) {
      return {
        success: false,
        message: "Could not retrieve authentication token.",
      };
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(
      `${API_URL}/api/applications/${applicationId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Could not cancel application.",
      };
    }

    return result;
  } catch (error) {
    console.error("Cancel application error:", error);

    return {
      success: false,
      message: "Could not cancel application.",
    };
  }
}

export async function applyForTuition(data: {
  tuitionId: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
}) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== "student") {
      return {
        success: false,
        message: "Only logged-in students can apply for tuition.",
      };
    }

    const {
      tuitionId,
      studentPhone,
      preferredSchedule,
      studentNote,
    } = data;

    if (!ObjectId.isValid(tuitionId)) {
      return {
        success: false,
        message: "Invalid tuition ID.",
      };
    }

    if (!studentPhone.trim() || !preferredSchedule.trim()) {
      return {
        success: false,
        message: "Phone number and preferred schedule are required.",
      };
    }

    const { token} = await auth.api.getToken({
      headers: requestHeaders,
    });

    if ( !token) {
      return {
        success: false,
        message: "Could not retrieve authentication token.",
      };
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const response = await fetch(
      `${API_URL}/api/applications/${tuitionId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentPhone: studentPhone.trim(),
          preferredSchedule: preferredSchedule.trim(),
          studentNote: studentNote.trim(),
        }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Could not submit application.",
      };
    }

    return result;
  } catch (error) {
    console.error("Apply for tuition error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
