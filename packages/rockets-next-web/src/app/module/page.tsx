"use client";

import Module from "@/shared/Module";

const ModuleScreen = () => {
  return (
    <Module
      resource="user"
      tableSchema={[
        {
          id: "id",
          numeric: false,
          disablePadding: false,
          label: "ID",
        },
        {
          id: "email",
          numeric: false,
          disablePadding: false,
          label: "Email",
        },
        {
          id: "username",
          numeric: false,
          disablePadding: false,
          label: "Username",
        },
        {
          id: "actions",
          numeric: false,
          disablePadding: false,
          label: "",
        },
      ]}
      formSchema={{
        type: "object",
        required: ["email", "username"],
        properties: {
          email: {
            type: "string",
            title: "Email",
            minLength: 3,
            format: "email",
          },
          username: { type: "string", title: "Username", minLength: 3 },
        },
      }}
    />
  );
};

export default ModuleScreen;
