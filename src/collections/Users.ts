import { CollectionConfig } from "payload/types";

const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ user, token }): string => {
        return `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${token}">Verify Email</a> `;
      },
    },
  },
  access: {
    read: (): boolean => true,
    create: (): boolean => true,
  },
  fields: [
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
  ],
};

export default Users;
