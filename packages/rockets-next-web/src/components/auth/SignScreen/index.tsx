"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@concepta/react-auth-provider";
import { SchemaForm } from "@concepta/react-material-ui/dist";
import { Image, Text, Link } from "@concepta/react-material-ui";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { IChangeEvent } from "@rjsf/core";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

import {
  type SignInFormData,
  type SignUpFormData,
  signInFormSchema,
  signUpFormSchema,
  widgets,
  advancedProperties,
} from "@/forms/auth";

interface Props {
  isSignUp?: boolean;
}

const SignScreen = ({ isSignUp }: Props) => {
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    username: "",
    password: "",
  });

  const router = useRouter();
  const { doLogin, isPending: isLoadingSignIn } = useAuth();
  const { post } = useDataProvider();

  const { execute: createAccount, isPending: isLoadingSignUp } = useQuery(
    (body: SignUpFormData) => post({ uri: "/user", body }),
    false,
    {
      onSuccess() {
        toast.success("Account successfully created.");
        router.push("/sign-in");
      },
      onError: (error) => {
        toast.error(
          // @ts-expect-error TODO: needs to fix types in rockets-react
          error?.response?.data?.message ??
            "An error has occurred. Please try again later or contact support for assistance."
        );
      },
    }
  );

  const handleLogin = (values: SignInFormData) => {
    const { username, password } = values;
    doLogin({ username, password, loginPath: "/auth/sign-in" });
  };

  const handleSignUp = async (values: SignUpFormData) => {
    const { email, username, password } = values;
    createAccount({ email, username, password });
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
            schema={isSignUp ? signUpFormSchema : signInFormSchema}
            validator={validator}
            formData={formData}
            onChange={({ formData }) => {
              setFormData(formData);
            }}
            onSubmit={({
              formData,
            }: IChangeEvent<SignInFormData | SignUpFormData>) =>
              isSignUp
                ? handleSignUp(formData as SignUpFormData)
                : handleLogin(formData as SignInFormData)
            }
            widgets={widgets}
            noHtml5Validate={true}
            showErrorList={false}
            advancedProperties={advancedProperties}
          >
            {!isSignUp && (
              <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 2 }}>
                <Link href="/forgot-password" color="primary.dark">
                  Forgot your password?
                </Link>
              </Text>
            )}

            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              mt={2}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={Boolean(isLoadingSignIn || isLoadingSignUp)}
                sx={{ flex: 1 }}
              >
                {isLoadingSignIn || isLoadingSignUp ? (
                  <CircularProgress sx={{ color: "white" }} size={24} />
                ) : (
                  "Send"
                )}
              </Button>
            </Box>
          </SchemaForm.Form>
        </Box>

        <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} color="primary.dark">
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
