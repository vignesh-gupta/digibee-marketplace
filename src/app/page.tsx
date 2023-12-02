import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ModeToggle } from "@/components/ui/theme-switch";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="py-20 mx-auto flex flex-col text-center items-center max-w-3xl">
        <ModeToggle />
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Your marketplace for high-quality{" "}
          <span className="text-blue-600">digital asset</span>{" "}
        </h1>
      </div>
    </MaxWidthWrapper>
  );
}
