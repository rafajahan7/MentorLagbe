
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

    const requestHeaders = await headers();

    // Check the logged-in tutor
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== "tutor") {
      return {
        success: false,
        message: "Only tutors can post tuitions.",
      };
    }

    // Validate tuition information
    if (
      !formData.title.trim() ||
      !formData.subject.trim() ||
      !formData.classLevel.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !Number.isFinite(formData.monthlyFee) ||
      formData.monthlyFee <= 0 ||
      !Number.isInteger(formData.daysPerWeek) ||
      formData.daysPerWeek < 1 ||
      formData.daysPerWeek > 7 ||
      !["Online", "Offline"].includes(formData.mode)
    ) {
      return {
        success: false,
        message: "Please provide valid tuition information.",
      };
    }

    // Retrieve Better Auth JWT
    const { token } = await auth.api.getToken({
      headers: requestHeaders,
    });

    if (!token) {
      return {
        success: false,
        message: "Could not retrieve authentication token.",
      };
    }

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Send tuition to Express backend
    const response = await fetch(`${API_URL}/api/tuitions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Could not create tuition.",
      };
    }

    return result;
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

