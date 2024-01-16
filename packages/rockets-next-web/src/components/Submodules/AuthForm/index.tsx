import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Container, Card, CircularProgress } from "@mui/material";
import { Text, Link, SchemaForm, Image } from "@concepta/react-material-ui";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { useAuth } from "@concepta/react-auth-provider";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

import {
  defaultAuthUiSchema,
  signInFormSchema,
  signUpFormSchema,
  forgotPasswordFormSchema,
  resetPasswordFormSchema,
} from "./constants";

import { validateForm } from "@/utils/formValidation/formValidation";

interface AuthFormSubmoduleProps {
  route: string;
  queryUri?: string;
  queryMethod?: string;
  title?: string;
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  signInRequestPath?: string;
  signInPath?: string;
  signUpPath?: string;
  forgotPasswordPath?: string;
  customValidation?: ValidationRule<Record<string, string>>[];
  submitButtonTitle?: string;
  logoSrc?: string;
}

const AuthFormSubmodule = (props: AuthFormSubmoduleProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passcode = searchParams.get("token");

  const { post, patch, put } = useDataProvider();
  const { doLogin, isPending: isLoadingSignIn } = useAuth();

  const query =
    {
      post: post,
      patch: patch,
      put: put,
    }[props.queryMethod || "post"] || post;

  const { execute: performRequest, isPending: isLoadingRequest } = useQuery(
    (body: Record<string, unknown>) =>
      query({
        uri: props.queryUri || "",
        body,
      }),
    false,
    {
      onSuccess() {
        toast.success("Success.");

        if (props.signInPath) {
          router.push(props.signInPath);
        }
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

  const handleSubmit = async (values: IChangeEvent<Record<string, string>>) => {
    const fields = values.formData || {};

    if (props.route === "signIn") {
      const { username, password } = fields;
      doLogin({ username, password, loginPath: props.signInRequestPath });

      return;
    }

    if (props.route === "resetPassword") {
      await performRequest({ ...fields, passcode });

      return;
    }

    performRequest(fields);
  };

  const isLoading = isLoadingSignIn || isLoadingRequest;

  const defaultRouteTitle = {
    signIn: "Sign in",
    signUp: "Sign up",
    forgotPassword: "Recover password",
    resetPassword: "Reset password",
  }[props.route];

  const defaultFormSchema =
    {
      signIn: signInFormSchema,
      signUp: signUpFormSchema,
      forgotPassword: forgotPasswordFormSchema,
      resetPassword: resetPasswordFormSchema,
    }[props.route] || {};

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", padding: "48px 0" }}>
      {props.logoSrc ? <Image src={props.logoSrc} alt="logo" /> : null}

      <Card sx={{ padding: "24px", marginTop: "32px" }}>
        <Text
          variant="h4"
          fontFamily="Inter"
          fontSize={30}
          fontWeight={800}
          mt={1}
          gutterBottom
        >
          {props.title || defaultRouteTitle}
        </Text>

        <SchemaForm.Form
          schema={props.formSchema || defaultFormSchema}
          uiSchema={props.formUiSchema || defaultAuthUiSchema}
          validator={validator}
          formData={props.formData}
          onSubmit={handleSubmit}
          noHtml5Validate={true}
          showErrorList={false}
          advancedProperties={props.advancedProperties}
          customValidate={(formData, errors) =>
            validateForm(formData, errors, props.customValidation || [])
          }
        >
          {props.forgotPasswordPath ? (
            <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 2 }}>
              <Link href={props.forgotPasswordPath} color="primary.dark">
                Forgot your password?
              </Link>
            </Text>
          ) : null}

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
              disabled={Boolean(isLoading)}
              sx={{ flex: 1 }}
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                props.submitButtonTitle || "Send"
              )}
            </Button>
          </Box>
        </SchemaForm.Form>

        {props.signInPath ? (
          <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
            <Link href={props.signInPath} color="primary.dark">
              Already have an account? Sign in
            </Link>
          </Text>
        ) : null}

        {props.signUpPath ? (
          <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
            <Link href={props.signUpPath} color="primary.dark">
              No account? Sign up
            </Link>
          </Text>
        ) : null}
      </Card>
    </Container>
  );
};

export default AuthFormSubmodule;
