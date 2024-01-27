import { Loader2, XCircle } from "lucide-react";

type ErrorAndLoadingProps = {
  isLoading: boolean;
  isError: boolean;
};

const ErrorAndLoading = ({ isError, isLoading }: ErrorAndLoadingProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-300" />
        <h3 className="text-xl font-semibold">Verifying...</h3>
        <p className="text-sm text-muted-foreground">
          This won&apos;t take long.
        </p>
      </div>
    );
  }

  // Error State of the Component
  if (isError)
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="w-8 h-8 text-red-600" />
        <h3 className="text-xl font-semibold">There was a problem</h3>
        <p className="text-sm text-muted-foreground">
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    );
};

export default ErrorAndLoading;
