import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../config";
import { CollectionConfig } from "payload/types";
import { Product } from "../payload-types";
import { stripe } from "../lib/stripe";

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === "create") {
          const data = args.data as Product;

          const createProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "usd",
              unit_amount: Math.round(data.price * 100),
            },
          });

          const updatedProduct: Product = {
            ...data,
            stripeId: createProduct.id,
            priceId: createProduct.default_price as string,
          };

          return updatedProduct;
        } else if (args.operation === "update") {
          const data = args.data as Product;

          const updateProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updatedProduct: Product = {
            ...data,
            stripeId: updateProduct.id,
            priceId: updateProduct.default_price as string,
          };

          return updatedProduct;
        }
      },
    ],
  },
  access: {},
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
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
    },
    {
      name: "product_files",
      label: "Product File(s)",
      type: "relationship",
      relationTo: "product_files",
      required: true,
      hasMany: false,
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      defaultValue: "pending",
      type: "select",
      required: true,
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        { label: "Pending Verification", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Denied", value: "rejected" },
      ],
    },
    {
      name: "priceId",
      label: "Price ID",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      label: "Stripe ID",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "images",
      label: "Product images",
      type: "array",
      minRows: 1,
      maxRows: 10,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};

export default Products;
