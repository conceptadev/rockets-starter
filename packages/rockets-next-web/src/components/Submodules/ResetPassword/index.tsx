import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";
import type { AdvancedProperty } from "@concepta/react-material-ui/dist/components/SchemaForm/types";

import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Container, Card, CircularProgress } from "@mui/material";
import { Text, Link, SchemaForm } from "@concepta/react-material-ui";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

import { validateForm } from "@/utils/formValidation/formValidation";

interface ResetPasswordSubmoduleProps {
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
  advancedProperties?: Record<string, AdvancedProperty>;
  formData?: Record<string, unknown> | null;
  loginPath?: string;
  signUpPath?: string;
}

const ResetPasswordSubmodule = (props: ResetPasswordSubmoduleProps) => {
  const { patch } = useDataProvider();

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { execute: resetPassword, isPending } = useQuery(
    (body: Record<string, unknown>) =>
      patch({
        uri: "/auth/recovery/password",
        body: { passcode: token, newPassword: body.newPassword },
      }),
    false,
    {
      onSuccess() {
        toast.success("New password successfully saved.");
        router.push("/sign-in");
      },
      // TODO: BE message is not friendly
      onError: () => {
        toast.error("Failed to reset password. Please try again later.");
      },
    }
  );

  const handleSubmit = async (values: IChangeEvent<Record<string, string>>) => {
    await resetPassword(values.formData || {});
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
          Reset password
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
            validateForm(formData, errors, [
              {
                field: "confirmNewPassword",
                test: (value, formData) => value !== formData.newPassword,
                message: "Your passwords don't match. Please try again",
              },
            ])
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
                "Send"
              )}
            </Button>
          </Box>
        </SchemaForm.Form>

        <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
          <Link href="/sign-in" color="primary.dark">
            Remember your password? Sign in
          </Link>
        </Text>
      </Card>
    </Container>
  );
};

export default ResetPasswordSubmodule;
