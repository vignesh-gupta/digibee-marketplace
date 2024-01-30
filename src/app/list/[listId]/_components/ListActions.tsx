import { TooltipProvider } from "@/components/ui/tooltip";
import useListActions from "@/hooks/use-list-actions";
import { List, User } from "@/payload-types";
import { Copy, Edit, Trash } from "lucide-react";
import TooltipButton from "./TooltipButton";
import { redirect, useRouter } from "next/navigation";

const ListActions = ({ user, list }: { user: User; list: List }) => {
  const router = useRouter();

  const { copyList, deleteList } = useListActions();

  const isOwner =
    user.id === (typeof list.user === "string" ? list.user : list.user.id);

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

  const onEditHandler = () => {
    router.push(`/list/${list.id}/edit`);
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
            <TooltipButton tooltipLabel="Edit list" onClick={onEditHandler}>
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
