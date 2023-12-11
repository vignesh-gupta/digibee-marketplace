import { User } from "../payload-types";
import {
  Access,
  CollectionConfig,
  CollectionBeforeOperationHook,
} from "payload/types";

const isAdminOrHasAccessToImage =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User;

    if (!user) return false;

    if (user.role === "admin") return true;

    return {
      user: {
        equals: req.user.id,
      },
    };
  };

const Media: CollectionConfig = {
  slug: "media",
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      return await isAdminOrHasAccessToImage()({ req });
    },
    delete: isAdminOrHasAccessToImage(),
    update: isAdminOrHasAccessToImage(),
  },
  hooks: {
    beforeOperation: [
      async ({ args, operation }) => {
        const files = args.req?.files;
        if (files && files.file && files.file.name && operation === "create") {
          const parts = files.file.name.split(".");
          files.file.name = 
          `${(Math.random() + 1).toString(36).substring(2)}-
          ${Math.random().toString(36).substring(2, 15)}.
          ${parts[parts.length - 1]}`;
        }
      },
    ],
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id };
      },
    ],
  },
  upload: {
    staticDir: "media",
    staticURL: "/media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
};

export default Media;
