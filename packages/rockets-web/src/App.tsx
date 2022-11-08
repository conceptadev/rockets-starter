import React, { PropsWithChildren } from "react";
import "./App.css";

import { AuthProvider, useAuth } from "@concepta/react-auth-provider";
import {
  NotificationProvider,
  useNotifications,
} from "@concepta/react-notification-provider";

import { ProtectedRoute, PublicRoute, Router } from "@concepta/react-router";

import { Notification } from "@concepta/react-ui-components";

import "@concepta/react-ui-components/dist/tailwind.css";

import Home from "./app/screens/Home";
import Login from "./app/screens/Login";
import NotFound from "./app/screens/NotFound";
import Unauthorized from "./app/screens/Unauthorized";

const App = () => {
  const { notification } = useNotifications();
  const { user } = useAuth();

  return (
    <div className="app">
      <div className="wrapper fadeInDown">
        <Router
          isAuth={!!user}
          NotFoundComponent={NotFound}
          UnauthorizedComponent={Unauthorized}
        >
          <ProtectedRoute path="/" Component={Home} />
          <PublicRoute path="/login" Component={Login} />
        </Router>
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
