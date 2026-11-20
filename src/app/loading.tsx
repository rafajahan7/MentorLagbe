
import LoadingSpinner from "@/components/shared/loading-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F4EC]">
      <LoadingSpinner
        text="Preparing your learning experience..."
        size="lg"
      />
    </div>
  );
}
