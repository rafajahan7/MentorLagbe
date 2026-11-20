
"use server";

import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { headers } from "next/headers";

export async function getMyProfile() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return null;
    }

    const user = await db.collection("users").findOne(
      { email: session.user.email },
      {
        projection: {
          name: 1,
          email: 1,
          image: 1,
          role: 1,
          plan: 1,
          phone: 1,
          bio: 1,
        },
      }
    );

    if (!user) return null;

    return {
      name: String(user.name ?? ""),
      email: String(user.email ?? ""),
      image: String(user.image ?? ""),
      role: String(user.role ?? ""),
      plan: String(user.plan ?? "free"),
      phone: String(user.phone ?? ""),
      bio: String(user.bio ?? ""),
    };
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
}

export async function updateMyProfile(data: {
  name: string;
  phone: string;
  bio: string;
  image: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Please sign in first.",
      };
    }

    const name = data.name.trim();
    const phone = data.phone.trim();
    const bio = data.bio.trim();
    const image = data.image.trim();

    if (!name || name.length > 100) {
      return {
        success: false,
        message: "Please enter a valid name.",
      };
    }

    if (phone.length > 30 || bio.length > 1000) {
      return {
        success: false,
        message: "Profile information is too long.",
      };
    }

    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      {
        $set: {
          name,
          phone,
          bio,
          image,
        },
      }
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "User profile not found.",
      };
    }

    return {
      success: true,
      message: "Profile updated successfully!",
    };
  } catch (error) {
    console.error("Update profile error:", error);

    return {
      success: false,
      message: "Could not update your profile.",
    };
  }
}
