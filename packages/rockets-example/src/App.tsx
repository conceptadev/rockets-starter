import React, { PropsWithChildren } from "react";
import "./App.css";

import { AuthProvider, useAuth } from "@rockts-org/react-auth-provider";
import {
  NotificationProvider,
  useNotifications,
} from "@rockts-org/react-notification-provider";

import {
  ProtectedRoute,
  PublicRoute,
  Router,
  useNavigate,
} from "@rockts-org/react-router";

import { SimpleLoginForm, Notification } from "@rockts-org/react-ui-components";

import "@rockts-org/react-ui-components/dist/tailwind.css";

const LoginForm = () => {
  const { doLogin, user } = useAuth();
  const { notify } = useNotifications();
  const navigateTo = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigateTo("/", { replace: true });
      notify({
        title: "Success",
        message: "Login Success",
        messageType: "success",
      });
    }
  }, [user]);

  const onClickSignIn = async (user: string, password: string) => {
    doLogin({ email: user, password });
  };

  return <SimpleLoginForm onClickSignIn={onClickSignIn} />;
};

const NotFound = () => {
  return <div>Not Found</div>;
};

const Unauthorized = () => {
  return <div>Unauthorized</div>;
};

const Home = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      LOGGED IN!
    </div>
  );
};

const Routes = () => {
  const { user } = useAuth();

  return (
    <Router
      isAuth={!!user}
      NotFoundComponent={NotFound}
      UnauthorizedComponent={Unauthorized}
    >
      <ProtectedRoute path="/" Component={Home} />
      <PublicRoute path="/login" Component={LoginForm} />
    </Router>
  );
};

const App = () => {
  const { notification } = useNotifications();

  return (
    <div className="app">
      <div className="wrapper fadeInDown">
        <Routes />
        {notification && <Notification {...notification} />}
      </div>
    </div>
  );
};

const AppWrapper: React.FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NotificationProvider>
  );
};

export default AppWrapper;
