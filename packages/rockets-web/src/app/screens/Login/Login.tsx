import React, { useState } from "react";

import { useAuth } from "@concepta/react-auth-provider";
import { useNotifications } from "@concepta/react-notification-provider";

import { useNavigate } from "@concepta/react-router";

import { SimpleLoginForm } from "@concepta/react-ui-components";
import { ReactComponent as NewLogo } from "../../../newLogo.svg";

import "@concepta/react-ui-components/dist/tailwind.css";

interface IErrors {
  user: string;
  password: string;
}

interface UserData {
  user: string;
  password: string;
}

const Login = () => {
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

export default Login;
