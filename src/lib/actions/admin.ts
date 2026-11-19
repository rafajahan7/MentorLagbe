
"use server";

import db from "@/lib/db";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function isAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.role === "admin";
}

export async function getAdminStats() {
  try {
    if (!(await isAdmin())) {
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


export async function getAllUsers() {
  try {
    if (!(await isAdmin())) {
      return {
        success: false,
        users: [],
      };
    }

    const users = await db
      .collection("users")
      .find(
        {},
        {
          projection: {
            name: 1,
            email: 1,
            image: 1,
            role: 1,
            plan: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    const formattedUsers = users.map((user) => ({
      _id: user._id.toString(),
      name: user.name || "Unknown User",
      email: user.email || "",
      image: user.image || "",
      role: user.role || "student",
      plan: user.plan || "free",
      createdAt: user.createdAt
        ? new Date(user.createdAt).toISOString()
        : "",
    }));

    return {
      success: true,
      users: formattedUsers,
    };
  } catch (error) {
    console.error("Get all users error:", error);

    return {
      success: false,
      users: [],
    };
  }
}

export async function updateUserRole(
  userId: string,
  newRole: "student" | "tutor" | "admin"
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return {
        success: false,
        message: "Unauthorized access.",
      };
    }

    const allowedRoles = ["student", "tutor", "admin"];

    if (!allowedRoles.includes(newRole)) {
      return {
        success: false,
        message: "Invalid user role.",
      };
    }

    if (!ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid user ID.",
      };
    }

    // Prevent an admin from accidentally removing their own admin access.
    if (session.user.id === userId) {
      return {
        success: false,
        message: "You cannot change your own admin role.",
      };
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          role: newRole,
        },
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    return {
      success: true,
      message: "User role updated successfully.",
    };
  } catch (error) {
    console.error("Update user role error:", error);

    return {
      success: false,
      message: "Could not update user role.",
    };
  }
}

