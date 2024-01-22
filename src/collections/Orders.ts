import { CollectionConfig } from "payload/types";
import { OwnedAndAdmin } from "./access";

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders on DigiBee.",
  },
  access: {
    read: OwnedAndAdmin,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user.role === "admin",
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: "products",
      label: "Products",
      relationTo: "products",
      type: "relationship",
      required: true,
      hasMany: true,
    },
  ],
};

export default Orders;
