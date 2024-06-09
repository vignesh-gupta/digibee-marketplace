"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

type DownloadButtonProps = {
  downloadLink: string;
  productName: string;
};

const DownloadButton = ({ downloadLink, productName }: DownloadButtonProps) => {
  const downloadFile = useCallback(async () => {
    try {
      const response = await fetch(downloadLink);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.className = "hidden";
      a.download = productName;
      document.body.appendChild(a);
      a.click();
    } catch {
      (error: Error) => {
        console.error("Error downloading file:", error);
        toast.error("Error downloading file");
      };
    }
  }, [downloadLink, productName]);

  return (
    <div className="w-auto">
      <Button className="w-auto" onClick={downloadFile} variant="link">
        Download now
      </Button>
    </div>
  );
};

export default DownloadButton;
