
"use client";

import { useEffect, useId, useState } from "react";
import { ImagePlus, Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (imageUrl: string) => void;
}

export default function ImageUpload({
  value,
  onChange,
}: ImageUploadProps) {
  const inputId = useId();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      const message = "Please select an image file.";
      setError(message);
      toast.error(message);
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      const message = "Image size must be less than 5 MB.";
      setError(message);
      toast.error(message);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  }

  async function handleUpload() {
    if (!file || loading) {
      if (!file) {
        const message = "Please select an image first.";
        setError(message);
        toast.error(message);
      }
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    toast.loading("Uploading your image...", {
      id: "image-upload",
    });

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.imageUrl) {
        throw new Error(result.message || "Image upload failed.");
      }

      onChange(result.imageUrl);
      setFile(null);
      setSuccess("Image uploaded successfully!");

      toast.success("Image uploaded successfully!", {
        id: "image-upload",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage, {
        id: "image-upload",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    if (loading) return;

    setFile(null);
    setPreview("");
    setError("");
    setSuccess("");
    onChange("");
  }

  const imageToShow = preview || value;

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#183F38]">
          Tuition Banner Image
        </label>

        <p className="mb-4 text-xs text-[#68736C]">
          Upload a relevant image for your tuition post. Maximum size: 5 MB.
        </p>

        {imageToShow ? (
          <div className="relative overflow-hidden rounded-2xl border border-[#183F38]/10 bg-white">
            <img
              src={imageToShow}
              alt="Tuition banner preview"
              className="h-56 w-full object-cover"
            />

            <button
              type="button"
              onClick={handleRemove}
              disabled={loading}
              aria-label="Remove selected image"
              className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-600 shadow transition hover:bg-red-50 disabled:opacity-50"
            >
              <X size={18} />
            </button>

            {value && !file && (
              <p className="bg-[#DCE9E2] px-4 py-2 text-xs font-semibold text-[#183F38]">
                Image uploaded and ready to save.
              </p>
            )}
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#183F38]/20 bg-white px-6 py-12 text-center transition hover:border-[#B58A35] hover:bg-[#DCE9E2]/30"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DCE9E2] text-[#183F38]">
              <ImagePlus size={27} />
            </div>

            <span className="text-sm font-bold text-[#183F38]">
              Choose an image
            </span>

            <span className="mt-2 text-xs text-[#68736C]">
              PNG, JPG, WEBP · Maximum 5 MB
            </span>
          </label>
        )}

        <input
          id={inputId}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#183F38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#28584E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading image...
            </>
          ) : (
            <>
              <Upload size={18} />
              Upload to ImgBB
            </>
          )}
        </button>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-xl bg-[#DCE9E2] px-4 py-3 text-sm text-[#183F38]">
          {success}
        </p>
      )}
    </div>
  );
}
