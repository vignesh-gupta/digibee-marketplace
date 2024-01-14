import { CollectionConfig } from "payload/types";
import { ownedOnly } from "./access";

const Cart: CollectionConfig = {
  slug: "cart",
  admin: {
    hidden: true,
  },
  access: {
    read: ownedOnly,
    create: ownedOnly,
    update: ownedOnly,
    delete: ownedOnly,
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
