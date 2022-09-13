import React, { PropsWithChildren, useState } from "react";
import "./App.css";

import { AuthProvider, useAuth } from "@concepta/react-auth-provider";
import {
  NotificationProvider,
  useNotifications,
} from "@concepta/react-notification-provider";

import {
  ProtectedRoute,
  PublicRoute,
  Router,
  useNavigate,
} from "@concepta/react-router";

import { SimpleLoginForm, Notification } from "@concepta/react-ui-components";
import { ReactComponent as NewLogo } from "./newLogo.svg";

//import "@concepta/react-ui-components/dist/tailwind.css";

import { Cadastro } from './pages/Cadastro/cadastro';
import {Dashboard} from './pages/Dashboard/dashboard';

interface IErrors {
  user: string;
  password: string;
}

interface UserData {
  user: string;
  password: string;
}

const LoginForm = () => {
  const { doLogin, user } = useAuth();
  const { notify } = useNotifications();
  const [errors, setErrors] = useState<IErrors>({
    user: "",
    password: "",
  });
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

  const onClickSignIn = async ({ user, password }: UserData) => {
    return doLogin({ username: user, password });
  };

  const onValidate = ({ user, password }: UserData) => {
    const newErrors = { ...errors };
    let error = false;
    if (!user) {
      newErrors["user"] = "Username is required";
      error = true;
    }
    if (!password) {
      newErrors["password"] = "Password is required";
      error = true;
    }
    if (error) {
      return setErrors(newErrors);
    }
    return onClickSignIn({ user, password });
  };

  return (
    <React.Fragment>
      <SimpleLoginForm
        onSignIn={onValidate}
        errors={errors}
        logo={<NewLogo />}
      />
    </React.Fragment>
  );
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
      <PublicRoute path="/cadastro" Component={Cadastro}/>
      <PublicRoute path="/login" Component={LoginForm} />
      <PublicRoute path="/dashboard" Component={Dashboard}/>
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
