
"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Reusable tutor authentication
async function getTutorSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "tutor") {
    return null;
  }

  return session;
}

// Reusable server-side JWT retrieval
async function getTutorToken() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "tutor") {
    return null;
  }

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  return token || null;
}

// 1. TUTOR DASHBOARD STATISTICS
export async function getTutorDashboardStats() {
  try {
    const session = await getTutorSession();

    if (!session) {
      return { success: false, stats: null };
    }

    const tutorEmail = session.user.email;

    const [
      totalTuitions,
      activeApprovedTuitions,
      totalApplicants,
      user,
    ] = await Promise.all([
      db.collection("tuitions").countDocuments({
        tutorEmail,
      }),

      db.collection("tuitions").countDocuments({
        tutorEmail,
        approvalStatus: "approved",
        isActive: true,
      }),

      db.collection("applications").countDocuments({
        tutorEmail,
      }),

      db.collection("users").findOne(
        { email: tutorEmail },
        { projection: { plan: 1 } }
      ),
    ]);

    return {
      success: true,
      stats: {
        totalTuitions,
        activeApprovedTuitions,
        totalApplicants,
        currentPlan: user?.plan === "pro" ? "Pro" : "Free",
      },
    };
  } catch (error) {
    console.error("Tutor dashboard stats error:", error);

    return {
      success: false,
      stats: null,
    };
  }
}

// 2. GET ALL TUITIONS CREATED BY THE LOGGED-IN TUTOR
export async function getMyTuitions() {
  try {
    const session = await getTutorSession();

    if (!session) {
      return [];
    }

    const tuitions = await db
      .collection("tuitions")
      .find({ tutorEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return tuitions.map((tuition) => {
      const createdAt = tuition.createdAt
        ? new Date(tuition.createdAt).toISOString()
        : null;

      return {
        _id: tuition._id.toString(),
        title: String(tuition.title ?? ""),
        subject: String(tuition.subject ?? ""),
        classLevel: String(tuition.classLevel ?? ""),
        mode:
          tuition.mode === "Online"
            ? ("Online" as const)
            : ("Offline" as const),
        location: String(tuition.location ?? ""),
        monthlyFee: Number(tuition.monthlyFee) || 0,
        daysPerWeek: Number(tuition.daysPerWeek) || 0,
        bannerImage: String(tuition.bannerImage ?? ""),
        description: String(tuition.description ?? ""),
        approvalStatus:
          tuition.approvalStatus === "approved"
            ? ("approved" as const)
            : tuition.approvalStatus === "rejected"
              ? ("rejected" as const)
              : ("pending" as const),
        isActive: Boolean(tuition.isActive),
        createdAt,
      };
    });
  } catch (error) {
    console.error("Get tutor tuitions error:", error);
    return [];
  }
}

// 3. GET APPLICATIONS FOR THE LOGGED-IN TUTOR
// Express: GET /api/applications/tutor
export async function getTutorApplications() {
  try {
    const token = await getTutorToken();

    if (!token) {
      return {
        success: false,
        applications: [],
      };
    }

    const response = await fetch(
      `${API_URL}/api/applications/tutor`,
      {
        method: "GET",
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
        applications: [],
      };
    }

    const applications = Array.isArray(result.data)
      ? result.data
      : [];

    return {
      success: true,
      applications: applications.map((application: {
        _id: string;
        tuitionId?: string;
        tuitionTitle?: string;
        studentName?: string;
        studentEmail?: string;
        studentPhone?: string;
        preferredSchedule?: string;
        studentNote?: string;
        monthlyFee?: number;
        status?: string;
        appliedAt?: string | Date;
      }) => {
        const appliedAt = application.appliedAt
          ? new Date(application.appliedAt)
          : null;

        return {
          _id: String(application._id),
          tuitionId: application.tuitionId || "",
          tuitionTitle:
            application.tuitionTitle || "Untitled Tuition",
          studentName:
            application.studentName || "Unknown Student",
          studentEmail: application.studentEmail || "",
          studentPhone:
            application.studentPhone || "Not provided",
          preferredSchedule:
            application.preferredSchedule || "Not provided",
          studentNote: application.studentNote || "",
          monthlyFee: Number(application.monthlyFee) || 0,
          status: application.status || "pending",
          appliedAt:
            appliedAt && !Number.isNaN(appliedAt.getTime())
              ? appliedAt.toISOString()
              : null,
        };
      }),
    };
  } catch (error) {
    console.error("Get tutor applications error:", error);

    return {
      success: false,
      applications: [],
    };
  }
}

// 4. ACCEPT OR REJECT AN APPLICATION
// Express: PATCH /api/applications/:id/accept
// Express: PATCH /api/applications/:id/reject
export async function updateTutorApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected"
) {
  try {
    const token = await getTutorToken();

    if (!token) {
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

    if (status !== "accepted" && status !== "rejected") {
      return {
        success: false,
        message: "Invalid application status.",
      };
    }

    const action = status === "accepted" ? "accept" : "reject";

    const response = await fetch(
      `${API_URL}/api/applications/${applicationId}/${action}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Application status update failed:", result);

      return {
        success: false,
        message:
          result.message || "Could not update application status.",
      };
    }

    return result;
  } catch (error) {
    console.error("Update tutor application error:", error);

    return {
      success: false,
      message: "Could not update application status.",
    };
  }
}

// 5. UPDATE A TUTOR'S OWN TUITION
// Express: PATCH /api/tuitions/:id
export async function updateMyTuition(
  tuitionId: string,
  data: {
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    description: string;
    bannerImage: string;
  }
) {
  try {
    const token = await getTutorToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (!ObjectId.isValid(tuitionId)) {
      return {
        success: false,
        message: "Invalid tuition ID.",
      };
    }

    if (
      !data.title.trim() ||
      !data.subject.trim() ||
      !data.classLevel.trim() ||
      !data.location.trim() ||
      !data.description.trim() ||
      !Number.isFinite(data.monthlyFee) ||
      data.monthlyFee <= 0 ||
      !Number.isInteger(data.daysPerWeek) ||
      data.daysPerWeek < 1 ||
      data.daysPerWeek > 7 ||
      !["Online", "Offline"].includes(data.mode)
    ) {
      return {
        success: false,
        message: "Please provide valid tuition details.",
      };
    }

    const response = await fetch(
      `${API_URL}/api/tuitions/${tuitionId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Could not update tuition.",
      };
    }

    return result;
  } catch (error) {
    console.error("Update tuition error:", error);

    return {
      success: false,
      message: "Could not update tuition.",
    };
  }
}

// 6. DELETE A TUTOR'S OWN TUITION
// Express: DELETE /api/tuitions/:id
export async function deleteMyTuition(tuitionId: string) {
  try {
    const token = await getTutorToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (!ObjectId.isValid(tuitionId)) {
      return {
        success: false,
        message: "Invalid tuition ID.",
      };
    }

    const response = await fetch(
      `${API_URL}/api/tuitions/${tuitionId}`,
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
        message: result.message || "Could not delete tuition.",
      };
    }

    return result;
  } catch (error) {
    console.error("Delete tuition error:", error);

    return {
      success: false,
      message: "Could not delete tuition.",
    };
  }
}

// 7. TOGGLE TUITION ACTIVE / CLOSED
// Express: PATCH /api/tuitions/:id/status
export async function toggleMyTuitionStatus(
  tuitionId: string,
  isActive: boolean
) {
  try {
    const token = await getTutorToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (
      !ObjectId.isValid(tuitionId) ||
      typeof isActive !== "boolean"
    ) {
      return {
        success: false,
        message: "Invalid request.",
      };
    }

    const response = await fetch(
      `${API_URL}/api/tuitions/${tuitionId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Could not update tuition status.",
      };
    }

    return result;
  } catch (error) {
    console.error("Toggle tuition status error:", error);

    return {
      success: false,
      message: "Could not update tuition status.",
    };
  }
}
