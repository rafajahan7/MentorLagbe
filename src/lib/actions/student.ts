
"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "student") {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (!ObjectId.isValid(applicationId)) {
      return {
        success: false,
        message: "Invalid application ID.",
      };
    }

    const result = await db.collection("applications").deleteOne({
      _id: new ObjectId(applicationId),
      studentEmail: session.user.email,
      status: "pending",
    });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message:
          "Application not found or it can no longer be cancelled.",
      };
    }

    return {
      success: true,
      message: "Application cancelled successfully.",
    };
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
    const session = await auth.api.getSession({
      headers: await headers(),
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

    const studentEmail = session.user.email;
    const studentName = session.user.name;

    const tuition = await db.collection("tuitions").findOne({
      _id: new ObjectId(tuitionId),
      approvalStatus: "approved",
      isActive: true,
    });

    if (!tuition) {
      return {
        success: false,
        message: "This tuition is no longer available.",
      };
    }

    const existingApplication = await db.collection("applications").findOne({
      tuitionId,
      studentEmail,
    });

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this tuition.",
      };
    }

    await db.collection("applications").insertOne({
      tuitionId,
      tuitionTitle: tuition.title,
      monthlyFee: tuition.monthlyFee,
      tutorEmail: tuition.tutorEmail,
      studentName,
      studentEmail,
      studentPhone: studentPhone.trim(),
      preferredSchedule: preferredSchedule.trim(),
      studentNote: studentNote.trim(),
      status: "pending",
      appliedAt: new Date(),
    });

    return {
      success: true,
      message: "Your application has been submitted successfully!",
    };
  } catch (error) {
    console.error("Apply for tuition error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
