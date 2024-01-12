import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import { Box, Button, Container, Card, CircularProgress } from "@mui/material";
import { Text, Link, SchemaForm } from "@concepta/react-material-ui";
import { useAuth } from "@concepta/react-auth-provider";
import validator from "@rjsf/validator-ajv6";

import { validateForm } from "@/utils/formValidation/formValidation";

interface SignInSubmoduleProps {
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  signInRequestPath?: string;
  signUpPath?: string;
  forgotPasswordPath?: string;
  customValidation?: ValidationRule<Record<string, string>>[];
}

const SignInSubmodule = (props: SignInSubmoduleProps) => {
  const { doLogin, isPending: isLoadingSignIn } = useAuth();

  const handleLogin = (values: IChangeEvent<Record<string, string>>) => {
    const { username, password } = values.formData || {};
    doLogin({ username, password, loginPath: props.signInRequestPath });
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", padding: "48px 0" }}>
      <Card sx={{ padding: "24px", marginTop: "32px" }}>
        <Text
          variant="h4"
          fontFamily="Inter"
          fontSize={30}
          fontWeight={800}
          mt={1}
          gutterBottom
        >
          Sign in
        </Text>
        <SchemaForm.Form
          schema={props.formSchema}
          uiSchema={props.formUiSchema}
          validator={validator}
          formData={props.formData}
          onSubmit={handleLogin}
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
              disabled={Boolean(isLoadingSignIn)}
              sx={{ flex: 1 }}
            >
              {isLoadingSignIn ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Send"
              )}
            </Button>
          </Box>
        </SchemaForm.Form>

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

export default SignInSubmodule;
