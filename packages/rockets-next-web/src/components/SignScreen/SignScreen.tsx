"use client";

import React, { FC } from "react";
import { useAuth } from "@concepta/react-auth-provider";
import { useRouter } from "next/navigation";
import { SimpleForm } from "@concepta/react-material-ui/dist";
import { FormType } from "@concepta/react-material-ui/dist/components/SimpleForm";
import { Image, Text, Link } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import { FormValidation } from "@rjsf/utils";
import { IChangeEvent } from "@rjsf/core";

interface FormData {
  username: string;
  password: string;
}

interface Props {
  isSignUp?: boolean;
}

const SignScreen: FC<Props> = ({ isSignUp }) => {
  const router = useRouter();

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

  const { doLogin, user } = useAuth?.() || {};

  React.useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user]);

  const validate = (formData: FormData, errors: FormValidation) => {
    if (!formData.username) {
      errors?.switch?.addError("Username is required");
    }
    if (!formData.password) {
      errors?.switch?.addError("Password is required");
    }

    return errors;
  };

  const handleSubmit = async (values: IChangeEvent<FormData>) => {
    const { username, password } = values.formData || {};
    username && password && doLogin?.({ username, password });
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", padding: "48px 0" }}>
      <Image src="/logo.svg" alt="Logo" />

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
          <SimpleForm form={form} onSubmit={handleSubmit} validate={validate} />
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

export default SignScreen;
