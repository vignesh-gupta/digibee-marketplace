import { useRouter } from "next/navigation";
import { toast } from "sonner";

const useAuth = () => {
  const router = useRouter();
  const signOut = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      toast.success("Signed out successfully.");

      router.push("/sign-in");
      router.refresh();
    } catch (e) {
      toast.error("Sign out failed. Please try again.");
    }
  };

  return { signOut };
};

export default useAuth;
