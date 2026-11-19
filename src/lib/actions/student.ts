
"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
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

    const [totalApplied, acceptedApplications, pendingApplications, user] =
      await Promise.all([
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
