import LoadingSpinner from "@/components/shared/loading-spinner";

export default function DashboardLoading() {
  return (
    <div className="min-h-[70vh] bg-[#F7F4EC] px-6 py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Dashboard heading skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-[#DCE9E2]" />
          <div className="h-4 w-80 max-w-full animate-pulse rounded bg-[#DCE9E2]" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-2xl border border-[#E5E1D7] bg-white p-6"
            >
              <div className="h-4 w-28 animate-pulse rounded bg-[#DCE9E2]" />
              <div className="h-9 w-20 animate-pulse rounded bg-[#DCE9E2]" />
            </div>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="rounded-2xl border border-[#E5E1D7] bg-white p-6">
          <div className="mb-6 h-6 w-44 animate-pulse rounded bg-[#DCE9E2]" />

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-lg bg-[#F1F3EE]"
              />
            ))}
          </div>
        </div>

        <LoadingSpinner text="Loading your dashboard..." size="sm" />
      </div>
    </div>
  );
}