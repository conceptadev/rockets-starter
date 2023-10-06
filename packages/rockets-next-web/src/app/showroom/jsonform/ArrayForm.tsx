import { FC } from "react";
import { Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { RJSFSchema } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/mui";
import {
  CustomTextFieldWidget,
  ArrayFieldTemplate,
} from "@concepta/react-material-ui/dist/styles/CustomWidgets";

const ArrayForm: FC = () => {
  const widgets = {
    TextWidget: CustomTextFieldWidget,
  };

  const schema: RJSFSchema = {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", title: "Name" },
      address: {
        type: "array",
        title: "Address",
        items: {
          title: "Address",
          type: "string",
        },
      },
    },
  };

  const log = (type: string) =>
    // eslint-disable-next-line no-console
    console.log.bind(console, type);

  const formData = {
    address: [""],
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
        Array form
      </Text>

      <Box>
        <Form
          schema={schema}
          formData={formData}
          validator={validator}
          onChange={log("changed")}
          onSubmit={(values) =>
            // eslint-disable-next-line no-console
            console.log("values", values)
          }
          onError={log("errors")}
          widgets={widgets}
          templates={{ ArrayFieldTemplate }}
          noHtml5Validate={true}
          showErrorList={false}
        >
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Send
          </Button>
        </Form>
      </Box>
    </>
  );
};

export default ArrayForm;
