import dotenv from "dotenv";
import { buildConfig } from "payload/config";
import { slateEditor } from "@payloadcms/richtext-slate";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import path from "path";
import { Media, Orders, ProductFiles, Products, Users } from "./collections";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const saveToS3Folder = (folder: string) => {
  return s3Adapter({
    config: {
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_BUCKET_REGION!,
      // ... Other S3 configuration
    },
    bucket: process.env.AWS_BUCKET_NAME!,
  });
};

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFiles, Orders],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: " - DigiBee",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter: saveToS3Folder("media"),
        },
        product_files: {
          adapter: saveToS3Folder("product_files"),
        },
      },
    }),
  ],
});
