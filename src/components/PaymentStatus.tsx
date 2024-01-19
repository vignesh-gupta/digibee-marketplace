"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type PaymentStatusProps = {
  orderEmail: string;
  orderId: string;
  isPaid: boolean;
};

const PaymentStatus = ({ orderEmail, isPaid, orderId }: PaymentStatusProps) => {
  const router = useRouter();

  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false,
      refetchInterval: (data) => (data?.isPaid ? false : 1000),
    }
  );

  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);

  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-foreground/60">
      <div>
        <p className="font-medium text-foreground/90">Shipping To</p>
        <p>{orderEmail}</p>
      </div>
      <div>
        <p className="font-medium text-foreground/90">Order Status</p>
        <p className="font-medium text-foreground/90">
          {isPaid ? "Payment Successful" : "Pending Payment"}
        </p>
      </div>
    </div>
  );
};

export default PaymentStatus;
