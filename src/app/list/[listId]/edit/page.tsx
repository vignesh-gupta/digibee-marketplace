"use client";

import CartItemLG from "@/components/cart/CartItemLG";
import { Button } from "@/components/ui/button";
import { TRANSACTION_FEE } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { List, Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ListEditPageProps = {
  params: {
    listId: string;
  };
};

const ListEditPage = ({ params: { listId } }: ListEditPageProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [listData, setListData] = useState<List | null>(null);
  const router = useRouter();

  if (!listId) router.push("/");

  let { data: user } = trpc.auth.getUser.useQuery();

  const { data } = trpc.list.getList.useQuery<List>(
    { id: listId },
    { enabled: !!listId }
  );

  const { mutate: updateList } = trpc.list.updateList.useMutation({
    onSuccess: ({ message }) => {
      if (message.includes("deleted")) {
        router.push("/");
      } else {
        router.push(`/list/${listId}`);
      }
      toast.success(message);
    },
    onError: (error) => {
      console.error("[ERROR]", error);
      toast.error("Something went wrong");
    },
  });

  useEffect(() => {
    setIsMounted(true);
    setListData(data ?? null);

    return () => {
      setIsMounted(false);
      setListData(null);
    };
  }, [data]);

  if (isMounted && !user)
    router.push(
      `/sign-in?origin=${encodeURIComponent(`/list/${listId}/edit`)}`
    );

  const isOwner =
    user?.id ===
    (typeof listData?.user === "string" ? listData.user : listData?.user.id);

  if (isMounted && (!listData || !isOwner)) router.push("/");

  let cartTotal = (listData?.products as Product[])?.reduce(
    (total, product) => total + product.price,
    0
  );

  const handleUpdateList = async () => {
    updateList({
      id: listId,
      productIds: listData?.products?.map((product) =>
        typeof product === "string" ? product : product.id
      ),
    });
  };

  const handleRemoveItem = (id: string) => {
    setListData(
      (prev) =>
        ({
          ...prev,
          products: (prev?.products as Product[])?.filter(
            (product) => product.id !== id
          ),
        } as List)
    );
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex gap-2 md:justify-between md:items-center flex-col md:flex-row ">
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90 sm:text-4xl">
            Shared Cart
          </h1>
          <Button onClick={handleUpdateList}>Done</Button>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && listData?.products?.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && listData?.products?.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/empty-cart.png"
                    layout="fill"
                    alt="Empty Cart"
                    loading="eager"
                  />
                </div>
                <h3 className="font-semibold text-2xl">Your cart is empty</h3>
                <p className="text-muted-foreground text-center ">
                  Woops! Looks like your list is empty, if you&apos;re saving
                  it, it might be deleted. yet.
                </p>
              </div>
            ) : null}

            <ul
              className={cn({
                "divide-y divide-foreground/20 text-foreground/20 border-b border-t border-foreground/20":
                  isMounted && (listData?.products as Product[])?.length > 0,
              })}
            >
              {(listData?.products as Product[])?.map((product) => (
                <CartItemLG
                  onClick={handleRemoveItem}
                  isEditable
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-foreground/5 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="font-medium text-foreground/90 text-lg">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-foreground/60">Subtotal</p>
                <p className="font-medium text-foreground/90 text-sm">
                  {isMounted ? (
                    formatPrice(Number(cartTotal))
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-foreground/20 text-foreground/20 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction fees</span>
                </div>
                <div className="text-sm font-medium text-foreground/90">
                  {isMounted ? (
                    formatPrice(cartTotal + Number(TRANSACTION_FEE))
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-muted text-foreground/20 pt-4">
                <div className="flex items-center text-base font-medium text-muted-foreground">
                  Order Total
                </div>
                <div className=" text-base font-medium text-foreground/90">
                  {isMounted ? (
                    formatPrice(cartTotal + Number(TRANSACTION_FEE))
                  ) : (
                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ListEditPage;
