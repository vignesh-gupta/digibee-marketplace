import { Access, CollectionConfig } from "payload/types";

const yourOwnOrder: Access = async ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    user: {
      equals: user.id,
    },
  };
};

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "name",
    description: "A summary of all the order on DigiBee",
  },
  access: {
    read: yourOwnOrder,
    update: ({ req }) => req.user?.role === "admin",
    create: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  fields: [
    {
      name: "isPaid",
      label: "Is Paid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user?.role === "admin",
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
