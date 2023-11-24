"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import { schema, uiSchema, FormData, validationRules } from "./formConfig";
import { validateForm } from "@/utils/formValidation/formValidation";

const ResetPasswordScreen: FC = () => {
  const { patch } = useDataProvider();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { execute: resetPassword, isPending } = useQuery(
    (body: FormData) =>
      patch({
        uri: "/auth/recovery/password",
        body: { passcode: token, newPassword: body.newPassword },
      }),
    false,
    {
      onSuccess() {
        toast.success("New password successfully saved.");
        router.push("/login");
      },
      // TODO: BE message is not friendly
      onError: () => {
        toast.error("Failed to reset password. Please try again later.");
      },
    }
  );

  const handleSubmit = async (values: IChangeEvent<FormData>) => {
    await resetPassword(values.formData || {});
  };

  return (
    <Container maxWidth="xs" sx={{ textAlign: "center", padding: "48px 0" }}>
      <Image src="/logo.svg" alt="Logo" />

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
            Reset Password
          </Text>

          <SchemaForm.Form
            schema={schema}
            validator={validator}
            onSubmit={handleSubmit}
            uiSchema={uiSchema}
            noHtml5Validate={true}
            showErrorList={false}
            customValidate={(formData, errors) =>
              validateForm(formData, errors, validationRules)
            }
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
          <Link href="/login" color="primary.dark">
            Remember your password? Sign in
          </Link>
        </Text>
      </Card>
    </Container>
  );
};

export default ResetPasswordScreen;
