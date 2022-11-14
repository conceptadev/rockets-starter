import React from "react";
// import logo from "./logo.svg";
// import "./App.css";
// import { SimpleForm } from "@concepta/react-material-ui/dist";
// import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";

import { PublicRoute, Router } from "@concepta/react-router";
import routes from "./routes";

const NotFound = () => {
  return <div>Not Found</div>;
};

const Unauthorized = () => {
  return <div>Unauthorized</div>;
};

function App() {
  // const form: FormType = {
  //   title: "Simplest form ever",
  //   submitButtonLabel: "Send",
  //   fields: {
  //     email: {
  //       type: "string",
  //       title: "Email",
  //       required: true,
  //     },
  //     password: {
  //       type: "password",
  //       title: "Password",
  //       required: true,
  //     },
  //   },
  // };

  return (
    <Router
      isAuth={false}
      NotFoundComponent={NotFound}
      UnauthorizedComponent={Unauthorized}
    >
      {routes.map((route) => (
        <PublicRoute
          path={route.route}
          Component={route.component}
          key={route.name}
          {...route.props}
        />
      ))}
    </Router>
  );
}

export default App;
