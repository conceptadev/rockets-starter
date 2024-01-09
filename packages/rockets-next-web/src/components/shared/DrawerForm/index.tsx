import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";

import { Box, Drawer, Button, CircularProgress } from "@mui/material";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";
import { SchemaForm } from "@concepta/react-material-ui";
import validator from "@rjsf/validator-ajv6";

type Action = "creation" | "edit" | "details" | null;

interface DrawerFormProps {
  isLoading?: boolean;
  formSchema: RJSFSchema;
  viewMode: Action | null;
  formUiSchema?: UiSchema;
  formData: Record<string, unknown> | null;
  onFormSubmit: (values: Record<string, unknown>) => void;
  onClose: () => void;
}

const widgets = {
  TextWidget: CustomTextFieldWidget,
};

const DrawerForm = (props: DrawerFormProps) => {
  const handleFormSubmit = async (
    values: IChangeEvent<Record<string, unknown>>
  ) => {
    const fields = values.formData || {};
    props.onFormSubmit(fields);
  };

  return (
    <Drawer open={props.viewMode !== null} anchor="right">
      <Box padding={4} mb={2}>
        <SchemaForm.Form
          schema={props.formSchema}
          uiSchema={props.formUiSchema}
          validator={validator}
          onSubmit={handleFormSubmit}
          widgets={widgets}
          noHtml5Validate={true}
          showErrorList={false}
          formData={props.formData}
          readonly={props.viewMode === "details"}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            mt={4}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={props.isLoading}
              sx={{ flex: 1, mr: 1 }}
            >
              {props.isLoading ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                "Save"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={props.onClose}
              sx={{ flex: 1, ml: 1 }}
            >
              Close
            </Button>
          </Box>
        </SchemaForm.Form>
      </Box>
    </Drawer>
  );
};

export default DrawerForm;
