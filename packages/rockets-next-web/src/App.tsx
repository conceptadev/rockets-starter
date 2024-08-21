import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RocketsProvider, createConfig } from "@concepta/react-material-ui";
import { Router, Resource } from "@concepta/react-navigation";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import ProfileScreen from "./pages/profile";

interface NetworkError {
  response: {
    data: {
      message: string;
    };
  };
}

function AdminProvider({
  children,
  home,
}: PropsWithChildren<{ home: string }>) {
  const navigate = useNavigate();

  const handleError = (error: unknown) => {
    toast.error(
      (error as NetworkError)?.response?.data?.message ||
        "Unable to process the request."
    );
  };

  const config = createConfig({
    dataProvider: {
      apiUrl: "http://localhost:3002",
    },
    auth: {
      onAuthSuccess: () => navigate(home),
      onAuthError: handleError,
      onLogout: () => navigate("/sign-in"),
    },
  });

  return <RocketsProvider {...config}>{children}</RocketsProvider>;
}

const schema: RJSFSchema = {
  type: "object",
  required: ["email", "username"],
  properties: {
    email: { type: "string", title: "Email", minLength: 3, format: "email" },
    username: { type: "string", title: "Username", minLength: 3 },
  },
};

const uiSchema: UiSchema = {
  email: {
    "ui:widget": CustomTextFieldWidget,
  },
  username: {
    "ui:widget": CustomTextFieldWidget,
  },
};

const App = () => {
  return (
    <Router AdminProvider={AdminProvider}>
      <Resource
        id="/user"
        name="Users"
        icon={<PersonOutlinedIcon />}
        module={{
          tableProps: {
            tableSchema: [
              { id: "id", label: "ID" },
              { id: "username", label: "Username" },
              { id: "email", label: "Email" },
            ],
            filters: [
              {
                id: "id",
                label: "ID",
                operator: "eq",
                type: "text",
                columns: 3,
              },
              {
                id: "username",
                label: "Username",
                operator: "contL",
                type: "text",
                columns: 3,
              },
              {
                id: "email",
                label: "Email",
                operator: "contL",
                type: "text",
                columns: 3,
              },
            ],
          },
          formContainerVariation: "modal",
          createFormProps: {
            formSchema: schema,
            formUiSchema: uiSchema,
          },
          editFormProps: {
            formSchema: schema,
            formUiSchema: uiSchema,
          },
          detailsFormProps: {
            formSchema: schema,
            formUiSchema: uiSchema,
          },
        }}
      />

      <Resource
        id="/profile"
        name="Profile"
        icon={<GroupsOutlinedIcon />}
        page={<ProfileScreen />}
      />
    </Router>
  );
};

export default App;
