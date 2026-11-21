
"use server";

import db from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Reusable admin authentication
async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return session;
}

// Reusable admin JWT retrieval
async function getAdminToken() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const { token } = await auth.api.getToken({
    headers: requestHeaders,
  });

  return token || null;
}

// 1. ADMIN DASHBOARD STATISTICS
export async function getAdminStats() {
  try {
    if (!(await getAdminSession())) {
      return {
        success: false,
        stats: null,
      };
    }

    const [
      totalUsers,
      totalTutors,
      pendingTuitions,
      approvedTuitions,
      rejectedTuitions,
      revenueRecords,
    ] = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("users").countDocuments({ role: "tutor" }),
      db.collection("tuitions").countDocuments({
        approvalStatus: "pending",
      }),
      db.collection("tuitions").countDocuments({
        approvalStatus: "approved",
      }),
      db.collection("tuitions").countDocuments({
        approvalStatus: "rejected",
      }),
      db.collection("payments").aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: "$currency",
            total: { $sum: "$amount" },
          },
        },
      ]).toArray(),
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        totalTutors,
        pendingTuitions,
        approvedTuitions,
        rejectedTuitions,
        revenueByCurrency: revenueRecords.map((record) => ({
          currency: record._id || "unknown",
          total: Number(record.total || 0),
        })),
      },
    };
  } catch (error) {
    console.error("Admin stats error:", error);

    return {
      success: false,
      stats: null,
    };
  }
}

// 2. GET ALL USERS
// Express: GET /api/admin/users
export async function getAllUsers() {
  try {
    const token = await getAdminToken();

    if (!token) {
      return {
        success: false,
        users: [],
      };
    }

    const response = await fetch(
      `${API_URL}/api/admin/users`,
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
        users: [],
      };
    }

    const users = Array.isArray(result.data) ? result.data : [];

    return {
      success: true,
      users: users.map((user: {
        _id: string;
        name?: string;
        email?: string;
        image?: string;
        role?: string;
        plan?: string;
        createdAt?: string | Date | null;
      }) => ({
        _id: String(user._id),
        name: user.name || "Unknown User",
        email: user.email || "",
        image: user.image || "",
        role: user.role || "student",
        plan: user.plan || "free",
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : "",
      })),
    };
  } catch (error) {
    console.error("Get all users error:", error);

    return {
      success: false,
      users: [],
    };
  }
}

// 3. UPDATE USER ROLE
// Express: PATCH /api/admin/users/:userId/role
export async function updateUserRole(
  userId: string,
  newRole: "student" | "tutor" | "admin"
) {
  try {
    const token = await getAdminToken();

    if (!token) {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    if (!ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID.",
      };
    }

    if (!["student", "tutor", "admin"].includes(newRole)) {
      return {
        success: false,
        message: "Invalid user role.",
      };
    }

    // Admin accounts must only be assigned through a trusted process.
    if (newRole === "admin") {
      return {
        success: false,
        message:
          "Admin roles can only be assigned through a trusted process.",
      };
    }

    const response = await fetch(
      `${API_URL}/api/admin/users/${userId}/role`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
        cache: "no-store",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Could not update user role.",
      };
    }

    return result;
  } catch (error) {
    console.error("Update user role error:", error);

    return {
      success: false,
      message: "Could not update user role.",
    };
  }
}

// 4. GET ALL ADMIN TUITIONS
// Express: GET /api/admin/tuitions
export async function getAllAdminTuitions() {
  try {
    const token = await getAdminToken();

    if (!token) {
      return {
        success: false,
        tuitions: [],
      };
    }

    const response = await fetch(
      `${API_URL}/api/admin/tuitions`,
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
        tuitions: [],
      };
    }

    const tuitions = Array.isArray(result.data) ? result.data : [];

    return {
      success: true,
      tuitions: tuitions.map((tuition: {
        _id: string;
        title?: string;
        subject?: string;
        classLevel?: string;
        mode?: string;
        location?: string;
        monthlyFee?: number;
        tutorName?: string;
        tutorEmail?: string;
        approvalStatus?: string;
        isActive?: boolean;
        createdAt?: string | Date | null;
      }) => ({
        _id: String(tuition._id),
        title: tuition.title || "",
        subject: tuition.subject || "",
        classLevel: tuition.classLevel || "",
        mode: tuition.mode || "Online",
        location: tuition.location || "",
        monthlyFee: Number(tuition.monthlyFee || 0),
        tutorName: tuition.tutorName || "Unknown Tutor",
        tutorEmail: tuition.tutorEmail || "",
        approvalStatus: tuition.approvalStatus || "pending",
        isActive: tuition.isActive ?? true,
        createdAt: tuition.createdAt
          ? new Date(tuition.createdAt).toISOString()
          : "",
      })),
    };
  } catch (error) {
    console.error("Get all admin tuitions error:", error);

    return {
      success: false,
      tuitions: [],
    };
  }
}

// 5. APPROVE OR REJECT TUITION
// Express: PATCH /api/tuitions/:id/approve
// Express: PATCH /api/tuitions/:id/reject
export async function updateTuitionApproval(
  tuitionId: string,
  status: "approved" | "rejected"
) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== "admin") {
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

    if (status !== "approved" && status !== "rejected") {
      return {
        success: false,
        message: "Invalid approval status.",
      };
    }

    const { token } = await auth.api.getToken({
      headers: requestHeaders,
    });

    if (!token) {
      return {
        success: false,
        message: "Could not retrieve authentication token.",
      };
    }

    const action = status === "approved" ? "approve" : "reject";

    const response = await fetch(
      `${API_URL}/api/tuitions/${tuitionId}/${action}`,
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
      return {
        success: false,
        message:
          result.message || "Could not update tuition approval.",
      };
    }

    return result;
  } catch (error) {
    console.error("Update tuition approval error:", error);

    return {
      success: false,
      message: "Could not update tuition approval.",
    };
  }
}

// 6. GET ALL TRANSACTIONS
export async function getAllTransactions() {
  try {
    if (!(await getAdminSession())) {
      return {
        success: false,
        transactions: [],
      };
    }

    const transactions = await db
      .collection("payments")
      .find({ paymentStatus: "paid" })
      .sort({ paidAt: -1 })
      .toArray();

    const formattedTransactions = transactions.map((payment) => ({
      _id: payment._id.toString(),
      userName: payment.userName || "Unknown User",
      userEmail: payment.userEmail || "",
      userRole: payment.userRole || "",
      planName: payment.planName || "Pro",
      amount: Number(payment.amount || 0),
      currency: payment.currency || "BDT",
      transactionId: payment.transactionId || "",
      paidAt: payment.paidAt
        ? new Date(payment.paidAt).toISOString()
        : "",
    }));

    return {
      success: true,
      transactions: formattedTransactions,
    };
  } catch (error) {
    console.error("Get transactions error:", error);

    return {
      success: false,
      transactions: [],
    };
  }
}
