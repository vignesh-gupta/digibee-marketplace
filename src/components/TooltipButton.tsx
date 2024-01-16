import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "./ui/button";

type TooltipButtonProps = {
  tooltipLabel: string;
  children: React.ReactNode;
};

const TooltipButton = ({ children, tooltipLabel }: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline">
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipLabel}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default TooltipButton;
