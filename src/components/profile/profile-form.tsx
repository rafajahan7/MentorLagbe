
"use client";

import { useState } from "react";
import { UserRound, Save, Loader2 } from "lucide-react";
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

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-[#183F38]/10 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="mb-8 border-b border-[#183F38]/10 pb-8">
        <h2 className="mb-2 text-lg font-bold text-[#183F38]">
          Profile Picture
        </h2>

        <p className="mb-5 text-sm text-[#68736C]">
          Upload a profile picture using ImgBB.
        </p>

        <div className="max-w-sm">
          <ImageUpload value={image} onChange={setImage} />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Full Name
          </label>

          <input
            required
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none focus:border-[#183F38]"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Email Address
          </label>

          <input
            disabled
            value={profile.email}
            className="w-full cursor-not-allowed rounded-xl border border-[#183F38]/10 bg-gray-100 px-4 py-3 text-sm text-gray-500"
          />

          <p className="mt-1 text-xs text-[#89928C]">
            Your registered email cannot be changed here.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Phone Number
          </label>

          <input
            type="tel"
            maxLength={30}
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none focus:border-[#183F38]"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#183F38]">
            Bio
          </label>

          <textarea
            rows={4}
            maxLength={1000}
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className="w-full resize-none rounded-xl border border-[#183F38]/15 bg-[#F7F4EC] px-4 py-3 text-sm text-[#242C2A] outline-none focus:border-[#183F38]"
            placeholder="Tell us a little about yourself..."
          />
        </div>
      </div>

      {message && (
        <p
          className={`mt-5 rounded-xl px-4 py-3 text-sm ${
            isError
              ? "bg-red-50 text-red-600"
              : "bg-[#DCE9E2] text-[#183F38]"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#183F38] px-6 py-3.5 font-semibold text-white transition hover:bg-[#24574C] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
