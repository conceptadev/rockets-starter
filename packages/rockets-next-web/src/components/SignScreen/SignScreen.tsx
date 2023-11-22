"use client";

import { FC } from "react";
import { useAuth } from "@concepta/react-auth-provider";
import { SchemaForm } from "@concepta/react-material-ui/dist";
import { Image, Text, Link } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv6";

import { schema, widgets, advancedProperties } from "./formConfig";

interface FormData {
  username: string;
  password: string;
}

interface Props {
  isSignUp?: boolean;
}

const SignScreen: FC<Props> = ({ isSignUp }) => {
  const { doLogin, isPending } = useAuth();

  const handleSubmit = async (values: IChangeEvent<FormData>) => {
    const { username, password } = values.formData || {};
    username &&
      password &&
      doLogin?.({ username, password, loginPath: "/auth/login" });
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
          <Text
            variant="h4"
            fontFamily="Inter"
            fontSize={30}
            fontWeight={800}
            mt={1}
            gutterBottom
          >
            {isSignUp ? "Sign up" : "Sign in"}
          </Text>
          <SchemaForm.Form
            schema={schema}
            validator={validator}
            onSubmit={handleSubmit}
            widgets={widgets}
            noHtml5Validate={true}
            showErrorList={false}
            advancedProperties={advancedProperties}
          >
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Button type="submit" variant="contained" sx={{ flex: 1 }}>
                {isPending ? (
                  <CircularProgress sx={{ color: "white" }} size={24} />
                ) : (
                  "Send"
                )}
              </Button>
            </Box>
          </SchemaForm.Form>
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
