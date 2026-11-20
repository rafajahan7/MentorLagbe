import { Suspense } from "react";

import Hero from "@/components/home/hero";
import FeaturedTuitions from "@/components/home/featured-tuitions";
import HowItWorks from "@/components/home/how-it-works";
import WhyMentorLagbe from "@/components/home/why-mentorlagbe";
import PricingPreview from "@/components/home/pricing-review";
import TopSubjects from "@/components/home/top-subjects";
import HomeCTA from "@/components/home/home-cta";

function FeaturedTuitionsFallback() {
  return (
    <section className="bg-[#F7F4EC] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<FeaturedTuitionsFallback />}>
        <FeaturedTuitions />
        <TopSubjects />

      </Suspense>

      <HowItWorks />
      <WhyMentorLagbe />
      <PricingPreview />
      <HomeCTA />
    </>
  );
}