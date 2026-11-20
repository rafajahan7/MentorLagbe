
"use server";

import db from "@/lib/db";
import { ObjectId } from "mongodb";

export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: Date;
}

interface TuitionDocument extends Omit<Tuition, "_id"> {
  _id: ObjectId;
}

export async function getApprovedTuitions(): Promise<Tuition[]> {
  try {
    const tuitions = await db
      .collection<TuitionDocument>("tuitions")
      .find({
        approvalStatus: "approved",
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .toArray();

    return tuitions.map((tuition) => ({
      ...tuition,
      _id: tuition._id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch tuitions:", error);

    return [];
  }
}


export async function getFeaturedTuitions(): Promise<Tuition[]> {
  try {
    const tuitions = await db
      .collection<TuitionDocument>("tuitions")
      .find({
        approvalStatus: "approved",
        isActive: true,
      })
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray();

    return tuitions.map((tuition) => ({
      ...tuition,
      _id: tuition._id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch featured tuitions:", error);
    return [];
  }
}


export async function createTuition(formData: {
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
}) {
  try {
    const { auth } = await import("@/lib/auth");
    const { headers } = await import("next/headers");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, message: "Please sign in first." };
    }

    if (session.user.role !== "tutor") {
      return {
        success: false,
        message: "Only tutors can post tuitions.",
      };
    }

    const user = await db.collection("users").findOne({
      email: session.user.email,
    });

    if (!user) {
      return { success: false, message: "User profile not found." };
    }

    const plan = user.plan === "pro" ? "pro" : "free";

    // Free tutors can have at most two tuition posts.
    if (plan === "free") {
      const existingPosts = await db.collection("tuitions").countDocuments({
        tutorEmail: session.user.email,
      });

      if (existingPosts >= 2) {
        return {
          success: false,
          message:
            "Free tutors can post a maximum of 2 tuitions. Upgrade to Pro for unlimited posts.",
        };
      }
    }

    // Basic server-side validation
    if (
      !formData.title.trim() ||
      !formData.subject.trim() ||
      !formData.classLevel.trim() ||
      !formData.description.trim() ||
      formData.monthlyFee <= 0 ||
      !Number.isInteger(formData.daysPerWeek) ||
      formData.daysPerWeek < 1 ||
      formData.daysPerWeek > 7
    ) {
      return {
        success: false,
        message: "Please provide valid tuition information.",
      };
    }

    await db.collection("tuitions").insertOne({
      ...formData,
      title: formData.title.trim(),
      subject: formData.subject.trim(),
      classLevel: formData.classLevel.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      tutorName: session.user.name,
      tutorEmail: session.user.email,
      approvalStatus: "pending",
      isActive: true,
      createdAt: new Date(),
    });

    return {
      success: true,
      message: "Tuition submitted successfully! Awaiting admin approval.",
    };
  } catch (error) {
    console.error("Create tuition error:", error);

    return {
      success: false,
      message: "Could not create tuition. Please try again.",
    };
  }
}

export async function getPendingTuitions() {
  try {
    const { auth } = await import("@/lib/auth");
    const { headers } = await import("next/headers");

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
      return [];
    }

    const tuitions = await db
      .collection("tuitions")
      .find({
        approvalStatus: "pending",
      })
      .sort({ createdAt: -1 })
      .toArray();

    return tuitions.map((tuition) => ({
      ...tuition,
      _id: tuition._id.toString(),
      createdAt: tuition.createdAt?.toISOString?.() ?? "",
    }));
  } catch (error) {
    console.error("Fetch pending tuitions error:", error);
    return [];
  }
}

export async function getTuitionById(id: string): Promise<Tuition | null> {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const tuition = await db
      .collection<TuitionDocument>("tuitions")
      .findOne({
        _id: new ObjectId(id),
        approvalStatus: "approved",
        isActive: true,
      });

    if (!tuition) {
      return null;
    }

    return {
      ...tuition,
      _id: tuition._id.toString(),
    };
  } catch (error) {
    console.error("Failed to fetch tuition details:", error);
    return null;
  }
}

