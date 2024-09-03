import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RocketsProvider, createConfig } from "@concepta/react-material-ui";
import { Router, Resource } from "@concepta/react-navigation";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import ProfileScreen from "./pages/profile";
import userModule from "./modules/user";

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
      apiUrl: import.meta.env.VITE_PUBLIC_API_URL,
    },
    auth: {
      onAuthSuccess: () => navigate(home),
      onAuthError: handleError,
      onLogout: () => navigate("/sign-in"),
    },
  });

  return <RocketsProvider {...config}>{children}</RocketsProvider>;
}

const App = () => {
  return (
    <Router AdminProvider={AdminProvider}>
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

export default App;
