import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";
import type { ValidationRule } from "@/utils/formValidation/formValidation";

import { Box, Button, Container, Card, CircularProgress } from "@mui/material";
import { Text, Link, SchemaForm } from "@concepta/react-material-ui";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

import { validateForm } from "@/utils/formValidation/formValidation";

interface ForgotPasswordSubmoduleProps {
  queryUri?: string;
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  signInPath?: string;
  signUpPath?: string;
  customValidation?: ValidationRule<Record<string, string>>[];
}

const ForgotPasswordSubmodule = (props: ForgotPasswordSubmoduleProps) => {
  const { post } = useDataProvider();

  const { execute: sendRecoveryPasswordLink, isPending } = useQuery(
    (body: Record<string, unknown>) =>
      post({
        uri: props.queryUri || "/auth/recovery/password",
        body,
      }),
    false,
    {
      onSuccess() {
        toast.success("Reset password link successfully sent to your e-mail.");
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
    await sendRecoveryPasswordLink(values.formData || {});
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
          Recover password
        </Text>
        <SchemaForm.Form
          schema={props.formSchema}
          uiSchema={props.formUiSchema}
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
              disabled={isPending}
              sx={{ flex: 1 }}
            >
              {isPending ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Email me a recovery link"
              )}
            </Button>
          </Box>
        </SchemaForm.Form>

        {props.signInPath ? (
          <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
            <Link href={props.signInPath} color="primary.dark">
              Remember your password? Sign in
            </Link>
          </Text>
        ) : null}
      </Card>
    </Container>
  );
};

export default ForgotPasswordSubmodule;
