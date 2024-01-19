import { User } from "@/payload-types";
import { Access } from "payload/config";

export const OwnedAndAdmin: Access = ({ req }) => {
  const user = req.user as User;

  if (!user) return false;

  if (user.role === "admin") return true;

  return {
    user: {
      equals: user?.id,
    },
  };
};

export const OwnedAndPurchased: Access = async ({ req }) => {
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

export const isAdminOrHasAccess: Access = ({ req: { user: _user } }) => {
  const user = _user as User | undefined;

  if (!user) return false;
  if (user.role === "admin") return true;

  const userProductIDs = (user.products || []).reduce<Array<string>>(
    (acc, product) => {
      if (!product) return acc;
      if (typeof product === "string") {
        acc.push(product);
      } else {
        acc.push(product.id);
      }

      return acc;
    },
    []
  );

  return {
    id: {
      in: userProductIDs,
    },
  };
};
