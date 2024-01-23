import { User } from "@/payload-types";
import { Access, CollectionConfig } from "payload/types";

const OwnedAndAdmin: Access = ({ req }) => {
  const user = req.user as User;

  if (!user) return false;

  if (user.role === "admin") return true;

  return {
    user: {
      equals: user?.id,
    },
  };
};

const ListCart: CollectionConfig = {
  slug: "list",
  access: {
    read: () => true,
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
