import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "./use-cart";

const useAuth = () => {
  const router = useRouter();
  const { clearCart } = useCart()
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

      clearCart();
      router.push("/sign-in");
      router.refresh();
      toast.success("Signed out successfully.");
    } catch (e) {
      toast.error("Sign out failed. Please try again.");
    }
  };

  return { signOut };
};

export default useAuth;
