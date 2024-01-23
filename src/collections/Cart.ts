import { CollectionConfig } from "payload/types";

const Cart: CollectionConfig = {
  slug: "cart",
  admin: {
    hidden: true,
  },
  fields: [
    {
      name: "products",
      label: "Products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "user",
      label: "Owner",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
  ],
};

export default Cart;
