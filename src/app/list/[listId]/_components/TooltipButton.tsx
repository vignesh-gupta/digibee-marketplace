import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";

type TooltipButtonProps = {
  tooltipLabel: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
};

const TooltipButton = ({ children, tooltipLabel, onClick }: TooltipButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" onClick={onClick}>
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
