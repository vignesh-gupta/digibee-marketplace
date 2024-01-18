import { TooltipProvider } from "@/components/ui/tooltip";
import useListActions from "@/hooks/use-list-actions";
import { List, User } from "@/payload-types";
import { Copy, Edit, Trash } from "lucide-react";
import TooltipButton from "./TooltipButton";

const ListActions = ({ user, list }: { user: User; list: List }) => {
  const isOwner =
    user.id === (typeof list.user === "string" ? list.user : list.user.id);

  const { copyList, deleteList } = useListActions();

  const onCopyHandler = () => {
    copyList({
      productIds: list.products?.map((product) =>
        typeof product === "string" ? product : product.id
      ),
    });
  };

  const onDeleteHandler = () => {
    deleteList({
      id: list.id,
    });
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        {!isOwner ? (
          <TooltipButton
            tooltipLabel="Create a copy of list"
            onClick={onCopyHandler}
          >
            <Copy className="h-4 w-4" />
          </TooltipButton>
        ) : (
          <>
            <TooltipButton tooltipLabel="Edit list">
              <Edit className="h-4 w-4" />
            </TooltipButton>

            <TooltipButton onClick={onDeleteHandler} tooltipLabel="Delete list">
              <Trash className="h-4 w-4" />
            </TooltipButton>
          </>
        )}
      </TooltipProvider>
    </div>
  );
};

export default ListActions;
