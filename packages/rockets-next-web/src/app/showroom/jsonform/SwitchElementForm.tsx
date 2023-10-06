import { FC } from "react";
import { Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/mui";
import { CustomSwitchWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

type FormData = {
  checkboxSolo: boolean;
};

const OtherFormElements: FC = () => {
  const schema: RJSFSchema = {
    type: "object",
    properties: {
      checkboxSolo: {
        type: "boolean",
        title: "I agree to subscribe",
        enum: [true, false],
      },
    },
  };

  const uiSchema: UiSchema = {
    checkboxSolo: {
      "ui:widget": CustomSwitchWidget,
    },
  };

  const handleSubmit = (values: IChangeEvent<FormData>) => {
    // eslint-disable-next-line no-console
    console.log("values", values.formData);
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
        Switch Element
      </Text>

      <Box>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          validator={validator}
          onSubmit={handleSubmit}
          noHtml5Validate={true}
          showErrorList={false}
          onError={(err) =>
            // eslint-disable-next-line no-console
            console.log("errors", err)
          }
        >
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Submit
          </Button>
        </Form>
      </Box>
    </>
  );
};

export default OtherFormElements;
