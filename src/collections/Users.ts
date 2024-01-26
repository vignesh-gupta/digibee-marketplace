import { AfterChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";
import { PrimaryActionEmailHtml } from "../components/email/PrimaryActionEmail";
import { User } from "../payload-types";

const adminAndUserOnly: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    id: {
      equals: user.id,
    },
  };
};

const createCart: AfterChangeHook<User> = async ({ operation, req, doc }) => {
  if (operation === "create") {
    const cart = await req.payload.create({
      collection: "cart",
      data: {
        user: doc.id,
        products: [],
      },
    });

    await req.payload.update({
      collection: "users",
      id: doc.id,
      data: {
        cart: cart.id,
      },
    });
  }
};

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    forgotPassword: {
      generateEmailHTML: (arg) => {
        const token = arg?.token || "";

        return PrimaryActionEmailHtml({
          actionLabel: "reset your password",
          buttonText: "Reset Password",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`,
        });
      },
    },
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
    read: adminAndUserOnly,
    create: (): boolean => true,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["id"],
  },
  hooks: {
    afterChange: [createCart],
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
