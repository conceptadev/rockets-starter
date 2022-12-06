import { FC } from "react";
import { Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RJSFSchema, UiSchema, FormValidation } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/mui";
import {
  CustomTextFieldWidget,
  CustomEmailFieldWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import emailValidation from "app/utils/emailValidation/emailValidation";

const FormElements: FC = () => {
  type FormData = {
    name: string;
    email: string;
  };

  const validate = (formData: FormData, errors: FormValidation) => {
    if (!emailValidation(formData.email)) {
      errors?.email?.addError("please enter a valid email");
    }

    return errors;
  };

  const schema: RJSFSchema = {
    type: "object",
    required: ["name", "email"],
    properties: {
      name: { type: "string", title: "Name" },
      email: { type: "string", title: "Email" },
    },
  };

  const uiSchema: UiSchema = {
    name: { "ui:widget": CustomTextFieldWidget },
    email: { "ui:widget": CustomEmailFieldWidget },
  };

  const handleSubmit = (
    values: IChangeEvent<FormData>,
    nativeEvent: React.FormEvent<HTMLFormElement>
  ) => {
    console.log("values", values);
    console.log("nativeEvent", nativeEvent);
  };

  return (
    <>
      <Text
        variant="h4"
        fontFamily="Inter"
        fontSize={24}
        fontWeight={800}
        mt={4}
        gutterBottom
      >
        Simple form
      </Text>

      <Box>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={handleSubmit}
          validator={validator}
          customValidate={validate}
          noHtml5Validate={true}
          showErrorList={false}
          onError={(err) => console.log("errors", err)}
        >
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Add contact
          </Button>
        </Form>
      </Box>
    </>
  );
};

export default FormElements;
