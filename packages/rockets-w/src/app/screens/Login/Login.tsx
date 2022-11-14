import React, { FC } from "react";
// import logo from "./logo.svg";
// import "./App.css";
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

const Login: FC = () => {
  const isSingUp = false;

  const form: FormType = {
    title: "Simplest form ever",
    submitButtonLabel: "Send",
    fields: {
      email: {
        type: "string",
        title: "Email",
        required: true,
      },
      password: {
        type: "password",
        title: "Password",
        required: true,
      },
    },
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
        {isSingUp ? "Sign up" : "Sign in"} to continue!
      </Text>

      <Card sx={{ marginTop: "26px", padding: "24px" }}>
        <Box>
          <SimpleForm
            form={form}
            onSubmit={(values) => console.log("values", values)}
            // validate={validate}
            // onError={onError}
            // initialData={initialData}
          />

          <Divider>
            <Text
              fontSize={14}
              fontWeight={400}
              color="text.primary"
              sx={{ my: 3 }}
            >
              Or continue with
            </Text>
          </Divider>
          {/* 
          <Button variant="outlined" fullWidth>
            <GitHubIcon sx={{ color: "text.primary" }} />
          </Button> */}
        </Box>

        <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
          <Link href={isSingUp ? "/login" : "/sign-up"} color="primary.dark">
            {isSingUp
              ? "Already have an account? Sign in"
              : "No account? Sign up"}
          </Link>
        </Text>
      </Card>
    </Container>
  );
};

export default Login;
