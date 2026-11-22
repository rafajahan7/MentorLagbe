
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

interface TuitionFilters {
  search?: string;
  subject?: string;
  classLevel?: string;
  mode?: "Online" | "Offline" | "";
}

const PAGE_SIZE = 6;

function buildTuitionQuery(filters?: TuitionFilters) {
  const query: Record<string, unknown> = {
    approvalStatus: "approved",
    isActive: true,
  };

  if (filters?.search?.trim()) {
    const searchTerm = filters.search.trim();

    const escapedSearch = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    query.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { subject: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (filters?.subject?.trim()) {
    query.subject = filters.subject.trim();
  }

  if (filters?.classLevel?.trim()) {
    query.classLevel = filters.classLevel.trim();
  }

  if (filters?.mode === "Online" || filters?.mode === "Offline") {
    query.mode = filters.mode;
  }

  return query;
}

// Existing function — kept for compatibility
export async function getApprovedTuitions(
  filters?: TuitionFilters
): Promise<Tuition[]> {
  try {
    const tuitions = await db
      .collection<TuitionDocument>("tuitions")
      .find(buildTuitionQuery(filters))
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

// New server-side pagination function
export async function getPaginatedApprovedTuitions(
  filters?: TuitionFilters,
  requestedPage = 1
) {
  try {
    const collection =
      db.collection<TuitionDocument>("tuitions");

    const query = buildTuitionQuery(filters);

    const totalTuitions = await collection.countDocuments(query);

    const totalPages = Math.ceil(totalTuitions / PAGE_SIZE);

    const currentPage = Math.min(
      Math.max(1, Math.floor(requestedPage) || 1),
      Math.max(totalPages, 1)
    );

    const tuitions = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .toArray();

    const subjects = await collection.distinct(
      "subject",
      {
        approvalStatus: "approved",
        isActive: true,
      }
    );

    const classLevels = await collection.distinct(
      "classLevel",
      {
        approvalStatus: "approved",
        isActive: true,
      }
    );

    return {
      tuitions: tuitions.map((tuition) => ({
        ...tuition,
        _id: tuition._id.toString(),
      })),
      currentPage,
      totalPages,
      totalTuitions,
      subjects: subjects.sort(),
      classLevels: classLevels.sort(),
    };
  } catch (error) {
    console.error("Failed to fetch paginated tuitions:", error);

    return {
      tuitions: [],
      currentPage: 1,
      totalPages: 0,
      totalTuitions: 0,
      subjects: [],
      classLevels: [],
    };
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

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session || session.user.role !== "tutor") {
      return {
        success: false,
        message: "Only tutors can post tuitions.",
      };
    }

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

export async function getTuitionById(
  id: string
): Promise<Tuition | null> {
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
