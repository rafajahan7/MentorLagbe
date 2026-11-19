
"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

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
        mode: tuition.mode === "Online" ? "Online" as const : "Offline" as const,
        location: String(tuition.location ?? ""),
        monthlyFee: Number(tuition.monthlyFee) || 0,
        daysPerWeek: Number(tuition.daysPerWeek) || 0,
        bannerImage: String(tuition.bannerImage ?? ""),
        description: String(tuition.description ?? ""),
        approvalStatus:
          tuition.approvalStatus === "approved"
            ? "approved" as const
            : tuition.approvalStatus === "rejected"
              ? "rejected" as const
              : "pending" as const,
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
export async function getTutorApplications() {
  try {
    const session = await getTutorSession();

    if (!session) {
      return {
        success: false,
        applications: [],
      };
    }

    const applications = await db
      .collection("applications")
      .find({ tutorEmail: session.user.email })
      .sort({ appliedAt: -1 })
      .toArray();

    return {
      success: true,
      applications: applications.map((application) => {
        const appliedAt = application.appliedAt
          ? new Date(application.appliedAt)
          : null;

        return {
          _id: application._id.toString(),
          tuitionId: application.tuitionId,
          tuitionTitle: application.tuitionTitle || "Untitled Tuition",
          studentName: application.studentName || "Unknown Student",
          studentEmail: application.studentEmail,
          studentPhone: application.studentPhone || "Not provided",
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
export async function updateTutorApplicationStatus(
  applicationId: string,
  status: "accepted" | "rejected"
) {
  try {
    const session = await getTutorSession();

    if (!session) {
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

    const result = await db.collection("applications").updateOne(
      {
        _id: new ObjectId(applicationId),
        tutorEmail: session.user.email,
        status: "pending",
      },
      {
        $set: { status },
      }
    );

    if (result.modifiedCount === 0) {
      return {
        success: false,
        message: "Application not found or already processed.",
      };
    }

    return {
      success: true,
      message: `Application ${status} successfully.`,
    };
  } catch (error) {
    console.error("Update tutor application error:", error);

    return {
      success: false,
      message: "Could not update application status.",
    };
  }
}

// 5. UPDATE A TUTOR'S OWN TUITION
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
    const session = await getTutorSession();

    if (!session) {
      return { success: false, message: "Unauthorized access." };
    }

    if (!ObjectId.isValid(tuitionId)) {
      return { success: false, message: "Invalid tuition ID." };
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
      return { success: false, message: "Please provide valid tuition details." };
    }

    const result = await db.collection("tuitions").updateOne(
      {
        _id: new ObjectId(tuitionId),
        tutorEmail: session.user.email,
      },
      {
        $set: {
          title: data.title.trim(),
          subject: data.subject.trim(),
          classLevel: data.classLevel.trim(),
          mode: data.mode,
          location: data.location.trim(),
          monthlyFee: data.monthlyFee,
          daysPerWeek: data.daysPerWeek,
          description: data.description.trim(),
          bannerImage: data.bannerImage.trim(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Tuition not found." };
    }

    return { success: true, message: "Tuition updated successfully." };
  } catch (error) {
    console.error("Update tuition error:", error);

    return {
      success: false,
      message: "Could not update tuition.",
    };
  }
}

// 6. DELETE A TUTOR'S OWN TUITION
export async function deleteMyTuition(tuitionId: string) {
  try {
    const session = await getTutorSession();

    if (!session) {
      return { success: false, message: "Unauthorized access." };
    }

    if (!ObjectId.isValid(tuitionId)) {
      return { success: false, message: "Invalid tuition ID." };
    }

    const tuition = await db.collection("tuitions").findOne({
      _id: new ObjectId(tuitionId),
      tutorEmail: session.user.email,
    });

    if (!tuition) {
      return { success: false, message: "Tuition not found." };
    }

    await db.collection("tuitions").deleteOne({
      _id: new ObjectId(tuitionId),
      tutorEmail: session.user.email,
    });

    // Remove applications associated with this tuition.
    await db.collection("applications").deleteMany({
      tuitionId,
      tutorEmail: session.user.email,
    });

    return {
      success: true,
      message: "Tuition deleted successfully.",
    };
  } catch (error) {
    console.error("Delete tuition error:", error);

    return {
      success: false,
      message: "Could not delete tuition.",
    };
  }
}

// 7. TOGGLE TUITION ACTIVE / CLOSED
export async function toggleMyTuitionStatus(
  tuitionId: string,
  isActive: boolean
) {
  try {
    const session = await getTutorSession();

    if (!session) {
      return { success: false, message: "Unauthorized access." };
    }

    if (!ObjectId.isValid(tuitionId) || typeof isActive !== "boolean") {
      return { success: false, message: "Invalid request." };
    }

    const result = await db.collection("tuitions").updateOne(
      {
        _id: new ObjectId(tuitionId),
        tutorEmail: session.user.email,
      },
      {
        $set: { isActive },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Tuition not found." };
    }

    return {
      success: true,
      message: isActive
        ? "Tuition activated successfully."
        : "Tuition closed successfully.",
    };
  } catch (error) {
    console.error("Toggle tuition status error:", error);

    return {
      success: false,
      message: "Could not update tuition status.",
    };
  }
}
