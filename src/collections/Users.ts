import { CollectionConfig } from "payload/types";
import { PrimaryActionEmailHtml } from "../components/email/PrimaryActionEmail";
import { OwnedAndAdmin } from "./access";

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${token}`,
        });
      },
    },
  },
  access: {
    read: OwnedAndAdmin,
    create: (): boolean => true,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["id"],
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
      name: "product_files",
      label: "Product Files",
      type: "relationship",
      relationTo: "product_files",
      admin: {
        condition: (): boolean => false,
      },
      hasMany: true,
    },
    {
      name: "role",
      required: true,
      defaultValue: "user",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
    {
      name: "cart",
      label: "Cart",
      type: "relationship",
      relationTo: "cart",
      hasMany: false,
    },
  ],
};

export default Users;
