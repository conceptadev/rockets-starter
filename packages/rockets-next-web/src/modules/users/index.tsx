"use client";

import { Box } from "@mui/material";
import { Text } from "@concepta/react-material-ui";

import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import CrudModule from "@/components/CrudModule";

const UsersModule = () => {
  return (
    <Box>
      <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
        Users
      </Text>

      <CrudModule
        resource="user"
        tableProps={{
          tableSchema: [
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
          ],
        }}
        drawerFormProps={{
          formSchema: {
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
          },
          formUiSchema: {
            email: {
              "ui:widget": CustomTextFieldWidget,
            },
            username: {
              "ui:widget": CustomTextFieldWidget,
            },
          },
        }}
      />
    </Box>
  );
};

export default UsersModule;
