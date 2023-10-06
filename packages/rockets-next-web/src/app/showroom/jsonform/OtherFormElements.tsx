import { FC } from "react";
import { Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/mui";
import {
  CustomCheckboxWidget,
  CustomCheckboxesWidget,
  CustomRadioWidget,
  CustomSelectWidget,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

type FormData = {
  checkboxSolo: boolean;
  checkboxGroup: string[];
  radio: string;
  select: string;
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
      checkboxGroup: {
        type: "array",
        title: "A multiple choices list",
        items: {
          type: "string",
          enum: ["foo", "bar", "fuzz", "qux"],
        },
        uniqueItems: true,
      },
      radio: {
        type: "string",
        title: "Which is your favorite for gaming?",
        enum: ["PS5", "Xbox", "PC", "Mobile"],
      },
      select: {
        type: "string",
        title: "Who's your favorite character",
        enum: ["Mario", "Sonic", "Lara Croft", "Pac-man"],
      },
    },
  };

  const uiSchema: UiSchema = {
    checkboxSolo: {
      "ui:widget": CustomCheckboxWidget,
    },
    checkboxGroup: {
      "ui:widget": CustomCheckboxesWidget,
    },
    radio: {
      "ui:widget": CustomRadioWidget,
    },
    select: {
      "ui:widget": CustomSelectWidget,
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
        Other Form Elements
      </Text>

      <Box>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          onSubmit={handleSubmit}
          validator={validator}
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
