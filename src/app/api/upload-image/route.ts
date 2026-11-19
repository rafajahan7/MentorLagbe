
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // Check whether the user is logged in
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please sign in first." },
        { status: 401 }
      );
    }

    // Only tutors and admins can upload tuition images
    const role = session.user.role;

    if (role !== "tutor" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "You are not allowed to upload images." },
        { status: 403 }
      );
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "ImgBB API key is missing." },
        { status: 500 }
      );
    }

    // Read the uploaded image
    const formData = await request.formData();
    const image = formData.get("image");

    if (!(image instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please select an image." },
        { status: 400 }
      );
    }

    // Validate image type
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "Only image files are allowed." },
        { status: 400 }
      );
    }

    // Maximum file size: 5 MB
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Image must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    // Upload to ImgBB
    const uploadData = new FormData();
    uploadData.append("image", image);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      console.error("ImgBB upload failed:", result);

      return NextResponse.json(
        { success: false, message: "Image upload failed. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      imageUrl: result.data.url,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { success: false, message: "Something went wrong during upload." },
      { status: 500 }
    );
  }
}
