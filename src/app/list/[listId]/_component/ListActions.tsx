import {
  TooltipProvider
} from "@/components/ui/tooltip";
import { List, User } from "@/payload-types";
import { Copy, Edit, Trash } from "lucide-react";
import TooltipButton from "./TooltipButton";

const ListActions = ({ user, list }: { user: User; list: List }) => {
  const isOwner =
    user.id === (typeof list.user === "string" ? list.user : list.user.id);

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <TooltipButton tooltipLabel="Create a copy of list">
          <Copy className="h-4 w-4" />
        </TooltipButton>

        {isOwner && (
          <>
            <TooltipButton tooltipLabel="Edit list">
              <Edit className="h-4 w-4" />
            </TooltipButton>

            <TooltipButton tooltipLabel="Delete list">
              <Trash className="h-4 w-4" />
            </TooltipButton>
          </>
        )}
      </TooltipProvider>
    </div>
  );
};

export default ListActions;
