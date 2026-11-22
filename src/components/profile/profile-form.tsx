"use client";

import { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateMyProfile } from "@/lib/actions/profile";
import ImageUpload from "@/components/tuitions/image-upload";

interface Profile {
  name: string;
  email: string;
  image: string;
  role: string;
  plan: string;
  phone: string;
  bio: string;
}

export default function ProfileForm({
  profile,
}: {
  profile: Profile;
}) {
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [bio, setBio] = useState(profile.bio);
  const [image, setImage] = useState(profile.image);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");

    try {
      const result = await updateMyProfile({
        name,
        phone,
        bio,
        image,
      });

      setIsError(!result.success);
      setMessage(result.message);

      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your profile changes have been saved.",
        });
      } else {
        toast.error("Profile update failed", {
          description: result.message,
        });
      }
    } catch {
      const errorMessage = "Something went wrong. Please try again.";

      setIsError(true);
      setMessage(errorMessage);

      toast.error("Unable to update profile", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-foreground";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8"
    >
      {/* Profile Picture */}
      <div className="mb-8 border-b border-border pb-8">
        <h2 className="mb-2 text-lg font-bold text-card-foreground">
          Profile Picture
        </h2>

        <p className="mb-5 text-sm text-muted-foreground">
          Upload a profile picture using ImgBB.
        </p>

        <div className="max-w-sm">
          <ImageUpload value={image} onChange={setImage} />
        </div>
      </div>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          <label className={labelClass}>
            Full Name
          </label>

          <input
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelClass}>
            Email Address
          </label>

          <input
            disabled
            value={profile.email}
            className="w-full cursor-not-allowed rounded-xl border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
          />

          <p className="mt-1 text-xs text-muted-foreground">
            Your registered email cannot be changed here.
          </p>
        </div>

        {/* Phone */}
        <div>
          <label className={labelClass}>
            Phone Number
          </label>

          <input
            type="tel"
            maxLength={30}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={inputClass}
            placeholder="Enter your phone number"
          />
        </div>

        {/* Bio */}
        <div>
          <label className={labelClass}>
            Bio
          </label>

          <textarea
            rows={4}
            maxLength={1000}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Tell us a little about yourself..."
          />
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
        <p
          role="alert"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
            isError
              ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
              : "border-[#DCE9E2] bg-[#DCE9E2] text-[#183F38] dark:border-[#29463E] dark:bg-[#183F38]/40 dark:text-[#DCE9E2]"
          }`}
        >
          {message}
        </p>
      )}

      {/* Save Button */}
      <button
        type="submit"
        disabled={loading}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#183F38] px-6 py-3.5 font-semibold text-white transition hover:bg-[#24574C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save size={18} />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}