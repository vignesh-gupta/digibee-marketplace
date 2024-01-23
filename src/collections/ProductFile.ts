import { S3UploadCollectionConfig } from "payload-s3-upload";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access } from "payload/types";
import { S3_URL } from "../lib/constants";
import { User } from "../payload-types";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};

const yourOwnAndPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (!user) return false;

  if (user?.role === "admin") return true;

  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const ownProductField = products
    .map((product) => product.product_files)
    .flat();

  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 0,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  const purchasedProductFileIds = orders.map((order) => {
    return order.products
      .map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            "Search depth is not sufficient to find product file IDs"
          );

        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      })
      .filter(Boolean)
      .flat();
  });

  return {
    id: {
      in: [...ownProductField, ...purchasedProductFileIds],
    },
  };
};

export const ProductFiles: S3UploadCollectionConfig = {
  slug: "product_files",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        const files = args.req?.files;
        if (files && files.file && files.file.name && operation === "create") {
          const parts = files.file.name.split(".");
          files.file.name = `product_files-${(Math.random() + 1)
            .toString(36)
            .substring(2)}-${Math.random().toString(36).substring(2, 15)}.${
            parts[parts.length - 1]
          }`;
        }
      },
    ],
    beforeChange: [addUser],
  },
  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: "product_files",
    staticURL: "/product_files",
    disableLocalStorage: true,
    mimeTypes: ["image/*", "font/*", "application/*", "text/*"],
    s3: {
      bucket: process.env.S3_BUCKET_NAME!,
      prefix: "product_files", // files will be stored in bucket folder images/xyz
    },
    adminThumbnail: ({ doc }) => `${S3_URL}/product_files/${doc.filename}`,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};

export default ProductFiles;
