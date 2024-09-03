import { redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { RocketsProvider, createConfig } from "@concepta/react-material-ui";
import { Router, Resource } from "@concepta/react-navigation";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import ProfileScreen from "./pages/profile";
import userModule from "./modules/user";

const App = () => {
  return (
    <Router>
      <Resource
        id="/user"
        name="Users"
        icon={<PersonOutlinedIcon />}
        module={userModule}
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

interface NetworkError {
  response: {
    data: {
      message: string;
    };
  };
}

const AdminProvider = () => {
  const handleError = (error: unknown) => {
    toast.error(
      (error as NetworkError)?.response?.data?.message ||
        "Unable to process the request."
    );
  };

  const config = createConfig({
    dataProvider: {
      apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
    },
    auth: {
      onAuthSuccess: () => redirect("user"),
      onAuthError: handleError,
      onLogout: () => redirect("/sign-in"),
    },
  });

  return (
    <RocketsProvider {...config}>
      <App />
    </RocketsProvider>
  );
};

export default AdminProvider;
