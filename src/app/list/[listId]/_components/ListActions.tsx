import { TooltipProvider } from "@/components/ui/tooltip";
import { List, User } from "@/payload-types";
import { Copy, Edit, Trash } from "lucide-react";
import TooltipButton from "./TooltipButton";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

const ListActions = ({ user, list }: { user: User; list: List }) => {
  const isOwner =
    user.id === (typeof list.user === "string" ? list.user : list.user.id);

  const router = useRouter();

  const { mutate: copyList } = trpc.list.createList.useMutation({
    onSuccess: ({ listId }) => {
      console.log("success");
      router.push(`/list/${listId}`);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const createCopyOfList = () => {
    copyList({
      productIds: list.products?.map((product) =>
        typeof product === "string" ? product : product.id
      ),
    });
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        {!isOwner ? (
          <TooltipButton
            tooltipLabel="Create a copy of list"
            onClick={createCopyOfList}
          >
            <Copy className="h-4 w-4" />
          </TooltipButton>
        ) : (
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
