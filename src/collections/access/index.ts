import { Access } from "payload/config";
import { User } from "payload/dist/auth";

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

export const adminAndUserOnly: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  return {
    id: {
      equals: user.id,
    },
  };
};
