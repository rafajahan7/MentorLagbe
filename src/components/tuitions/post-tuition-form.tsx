
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTuition } from "@/lib/actions/tuitions";
import ImageUpload from "@/components/tuitions/image-upload";
import { Loader2, Send } from "lucide-react";

const subjects = [
  "Mathematics",
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Bangla",
  "ICT",
  "Science",
  "Accounting",
  "Economics",
  "Statistics",
  "Programming",
  "IELTS",
  "All Subjects",
  "Other",
];

const classLevels = [
  "Class 1-5",
  "Class 6-8",
  "Class 9-10",
  "Class 11-12",
  "O Level",
  "A Level",
  "University",
  "Admission Test",
  "Professional",
];

export default function PostTuitionForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const tuitionData = {
      title: String(formData.get("title") || ""),
      subject: String(formData.get("subject") || ""),
      classLevel: String(formData.get("classLevel") || ""),
      mode: formData.get("mode") as "Online" | "Offline",
      location: String(formData.get("location") || ""),
      monthlyFee: Number(formData.get("monthlyFee")),
      daysPerWeek: Number(formData.get("daysPerWeek")),
      bannerImage,
      description: String(formData.get("description") || ""),
    };

    try {
      const result = await createTuition(tuitionData);

      if (!result.success) {
        setError(result.message);
        toast.error(result.message);
        return;
      }

      setMessage(result.message);

      toast.success("Tuition submitted successfully!", {
        description: "Your tuition is now pending admin approval.",
        duration: 4000,
      });

      formElement.reset();
      setBannerImage("");

      router.refresh();
    } catch (err) {
      console.error("Tuition submission failed:", err);

      const errorMessage = "Something went wrong. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-[#B58A35] focus:ring-2 focus:ring-[#B58A35]/20";

  const labelClass =
    "mb-2 block text-sm font-semibold text-foreground";

  const sectionClass =
    "rounded-3xl border border-border bg-card p-6 md:p-8";

  const headingClass =
    "text-xl font-bold text-card-foreground";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section className={sectionClass}>
        <h2 className={headingClass}>
          Tuition Information
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Tell students about the learning opportunity you are offering.
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Tuition Title *
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={100}
              placeholder="e.g. Experienced Mathematics Tutor for Class 9"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="subject" className={labelClass}>
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select subject
              </option>
              {subjects.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="classLevel" className={labelClass}>
              Class Level *
            </label>
            <select
              id="classLevel"
              name="classLevel"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select class level
              </option>
              {classLevels.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mode" className={labelClass}>
              Learning Mode *
            </label>
            <select
              id="mode"
              name="mode"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select learning mode
              </option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              name="location"
              placeholder="e.g. Dhanmondi, Dhaka"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Schedule and Fee */}
      <section className={sectionClass}>
        <h2 className={headingClass}>
          Schedule & Compensation
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="monthlyFee" className={labelClass}>
              Monthly Fee (BDT) *
            </label>
            <input
              id="monthlyFee"
              name="monthlyFee"
              type="number"
              min="1"
              required
              placeholder="e.g. 5000"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="daysPerWeek" className={labelClass}>
              Days Per Week *
            </label>
            <select
              id="daysPerWeek"
              name="daysPerWeek"
              required
              defaultValue=""
              className={inputClass}
            >
              <option value="" disabled>
                Select days
              </option>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <option key={day} value={day}>
                  {day} {day === 1 ? "day" : "days"} per week
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Description and Image */}
      <section className={sectionClass}>
        <h2 className={headingClass}>
          Description & Banner
        </h2>

        <div className="mt-7 space-y-7">
          <div>
            <label htmlFor="description" className={labelClass}>
              Tuition Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              minLength={20}
              maxLength={3000}
              rows={6}
              placeholder="Describe the tuition, learning goals, requirements and teaching approach..."
              className={`${inputClass} resize-y`}
            />
          </div>

          <ImageUpload
            value={bannerImage}
            onChange={setBannerImage}
          />
        </div>
      </section>

      {/* Feedback */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-[#DCE9E2] p-4 text-sm font-medium text-[#183F38] dark:border-emerald-900 dark:bg-[#29443D] dark:text-[#DCE9E2]"
        >
          {message}
          <p className="mt-1 text-xs">
            Your tuition is pending admin approval.
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#183F38] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#28584E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={18} />
            Submit Tuition for Approval
          </>
        )}
      </button>

      <p className="text-center text-xs leading-6 text-muted-foreground">
        Your tuition will become publicly visible only after admin approval.
      </p>
    </form>
  );
}
