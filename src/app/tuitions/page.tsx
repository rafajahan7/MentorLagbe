
import { getApprovedTuitions } from "@/lib/actions/tuitions";
import TuitionList from "@/components/tuitions/tuition-list";

export const metadata = {
  title: "Browse Tuitions",
  description:
    "Explore approved tuition opportunities and find the right learning match.",
};

export default async function TuitionsPage() {
  const tuitions = await getApprovedTuitions();

  return (
    <div className="min-h-screen bg-[#F7F4EC]">
      {/* Page Heading */}
      <section className="border-b border-[#183F38]/10 bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-bold tracking-[0.2em] text-[#B58A35]">
            EXPLORE OPPORTUNITIES
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#183F38] md:text-5xl">
            Find your perfect
            <span className="text-[#D9A441]"> tuition.</span>
          </h1>

          <p className="mt-5 max-w-2xl leading-8 text-[#68736C]">
            Discover tuition opportunities that match your subject,
            academic level, preferred learning mode, and budget.
          </p>
        </div>
      </section>

      {/* Search, Filters and Tuition Cards */}
      <TuitionList tuitions={tuitions} />
    </div>
  );
}
