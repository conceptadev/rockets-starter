import React, { FC, useState } from "react";
// import logo from "./logo.svg";
// import "./App.css";
import { useAuth } from "@concepta/react-auth-provider";
import { SimpleForm } from "@concepta/react-material-ui/dist";
import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";
import {
  Box,
  Button,
  Container,
  Image,
  Text,
  Card,
  Link,
  Divider,
} from "@concepta/react-material-ui";
import logo from "app/assets/images/logo.svg";

interface IErrors {
  username: string;
  password: string;
}

interface UserData {
  username: string;
  password: string;
}

const Login: FC = () => {
  const isSignUp = false;

  const form: FormType = {
    title: "Simplest form ever",
    submitButtonLabel: "Send",
    fields: {
      username: {
        type: "string",
        title: "Username",
        required: true,
      },
      password: {
        type: "password",
        title: "Password",
        required: true,
      },
    },
  };

  // @ts-expect-error: add types
  const { doLogin, user } = useAuth();
  // const { notify } = useNotifications();
  const [errors, setErrors] = useState<IErrors>({
    username: "",
    password: "",
  });
  // const navigateTo = useNavigate();

  React.useEffect(() => {
    if (user) {
      console.log("user Logged", user);
      // navigateTo("/", { replace: true });
      // notify({
      //   title: "Success",
      //   message: "Login Success",
      //   messageType: "success",
      // });
    }
  }, [user]);

  const onClickSignIn = async ({ username, password }: UserData) => {
    console.log("onClickSignIn", { username, password });
    return doLogin({ username, password });
  };

  const onValidate = ({ username, password }: UserData) => {
    const newErrors = { ...errors };
    let error = false;
    if (!username) {
      newErrors["username"] = "Username is required";
      error = true;
    }
    if (!password) {
      newErrors["password"] = "Password is required";
      error = true;
    }
    if (error) {
      console.log("error", error);
      return setErrors(newErrors);
    }
    return onClickSignIn({ username, password });
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", padding: "48px 0" }}>
      <Image src={logo} alt="Logo" />

      <Text
        variant="h4"
        fontFamily="Inter"
        fontSize={30}
        fontWeight={800}
        mt={1}
        gutterBottom
      >
        Welcome
      </Text>

      <Text fontSize={14} fontWeight={500} color="primary.dark">
        {isSignUp ? "Sign up" : "Sign in"} to continue!
      </Text>

      <Card sx={{ marginTop: "26px", padding: "24px" }}>
        <Box>
          <SimpleForm
            form={form}
            onSubmit={(values) => onValidate(values.formData)}
            // validate={validate}
            // onError={onError}
            // initialData={initialData}
          />
        </Box>

        <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
          <Link href={isSignUp ? "/login" : "/sign-up"} color="primary.dark">
            {isSignUp
              ? "Already have an account? Sign in"
              : "No account? Sign up"}
          </Link>
        </Text>
      </Card>
    </Container>
  );
};

export default Login;
