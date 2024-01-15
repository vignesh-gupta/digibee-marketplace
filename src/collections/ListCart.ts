import { CollectionConfig } from "payload/types";
import { OwnedAndAdmin } from "./access";

const ListCart: CollectionConfig = {
  slug: "list",
  access: {
    read: OwnedAndAdmin,
    create: OwnedAndAdmin,
    update: OwnedAndAdmin,
    delete: OwnedAndAdmin,
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

export default ListCart;
