import { S3UploadCollectionConfig } from "payload-s3-upload";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { S3_URL } from "../lib/constants";
import { User } from "../payload-types";
import { OwnedAndPurchased } from "./access";

const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
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
          files.file.name = `media-${(Math.random() + 1)
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
    read: OwnedAndPurchased,
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  upload: {
    staticDir: "product_files",
    staticURL: "/product_files",
    disableLocalStorage: true,
    mimeTypes: ["image/*", "font/*", "application/postscript"],
    s3: {
      bucket: process.env.S3_BUCKET_NAME!,
      prefix: "product_files", // files will be stored in bucket folder images/xyz
    },
    adminThumbnail: ({ doc }) => `${S3_URL}/media/${doc.filename}`,
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
