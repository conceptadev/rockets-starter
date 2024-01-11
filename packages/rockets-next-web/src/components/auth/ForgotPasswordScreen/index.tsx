"use client";

import { useState } from "react";
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

import { forgotPasswordFormSchema, widgets } from "@/forms/auth";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordScreen = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });

  const { post } = useDataProvider();

  const { execute: sendRecoveryPasswordLink, isPending } = useQuery(
    (body: ForgotPasswordFormData) =>
      post({
        uri: "/auth/recovery/password",
        body: { email: body.email },
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

  const handleSubmit = async (values: IChangeEvent<ForgotPasswordFormData>) => {
    const { email } = values.formData || {};
    await sendRecoveryPasswordLink({ email });
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
            Recover Password
          </Text>
          <SchemaForm.Form
            schema={forgotPasswordFormSchema}
            validator={validator}
            formData={formData}
            onChange={({ formData }) => {
              setFormData(formData);
            }}
            onSubmit={handleSubmit}
            widgets={widgets}
            noHtml5Validate={true}
            showErrorList={false}
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
        </Box>

        <Text fontSize={14} fontWeight={500} gutterBottom sx={{ mt: 3 }}>
          <Link href="/sign-in" color="primary.dark">
            Remember your password? Sign in
          </Link>
        </Text>
      </Card>
    </Container>
  );
};

export default ForgotPasswordScreen;
