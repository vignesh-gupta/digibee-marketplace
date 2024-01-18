import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useListActions = () => {
  const router = useRouter();

  const { mutate: copyList } = trpc.list.createList.useMutation({
    onSuccess: ({ listId }) => {
      console.log("success");
      router.push(`/list/${listId}`);
      toast.success("List Copied successfully!");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateList } = trpc.list.updateList.useMutation({
    onSuccess: () => {
      console.log("success");
    },
    onError: (error) => {
      console.log(error);
    },
  })

  const { mutate: deleteList } = trpc.list.deleteList.useMutation({
    onSuccess: () => {
      console.log("success");
      router.push("/");
      toast.success("List Deleted successfully!");
    },
    onError: (error) => {
      console.log(error);
    },
  })

  return { copyList , updateList , deleteList }
  
};


export default useListActions;