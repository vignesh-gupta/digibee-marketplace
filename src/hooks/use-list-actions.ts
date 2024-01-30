import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useListActions = () => {
  const router = useRouter();

  const { mutate: copyList } = trpc.list.createList.useMutation({
    onSuccess: ({ listId }) => {
      router.push(`/list/${listId}`);
      toast.success("List Copied successfully!");
    },
    onError: (error) => {
      console.error("[ERROR]",error);
    },
  });

  const { mutate: updateList } = trpc.list.updateList.useMutation({
    onSuccess: () => {},
    onError: (error) => {
      console.error("[ERROR]",error);
    },
  });

  const { mutate: deleteList } = trpc.list.deleteList.useMutation({
    onSuccess: () => {
      router.push("/");
      toast.success("List Deleted successfully!");
    },
    onError: (error) => {
      console.error("[ERROR]",error);
    },
  });

  return { copyList, updateList, deleteList };
};

export default useListActions;
