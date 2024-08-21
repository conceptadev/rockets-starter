import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import Router from "./components/Router";
import Resource from "./components/Resource";
import AppBarContainer from "./components/AppBarContainer";
import RocketsProvider from "./components/RocketsProvider";
import createConfig from "./components/RocketsProvider/utils";

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
    <Router
      AdminProvider={AdminProvider}
      renderAppBar={(menuItems, children) => {
        return (
          <AppBarContainer menuItems={menuItems}>{children}</AppBarContainer>
        );
      }}
    >
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
          },
          formContainerVariation: "modal",
          editFormProps: {
            formSchema: schema,
            formUiSchema: uiSchema,
            // onError: onEditError,
            // onSuccess: onEditSuccess,
            // onDeleteSuccess: onDeleteSuccess,
            // onDeleteError: onDeleteError,
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
