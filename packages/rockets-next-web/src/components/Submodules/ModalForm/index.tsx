import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { IChangeEvent } from "@rjsf/core";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { SchemaForm } from "@concepta/react-material-ui";
import validator from "@rjsf/validator-ajv6";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { toast } from "react-toastify";
import { CustomTextFieldWidget } from "@concepta/react-material-ui/dist/styles/CustomWidgets";

import { defaultFormProps } from "@/components/CrudModule/constants";
import { useMemo } from "react";

const widgets = {
  TextWidget: CustomTextFieldWidget,
};

type Action = "creation" | "edit" | "details" | null;

interface ModalFormSubmoduleProps {
  title?: string;
  queryResource: string;
  formSchema?: RJSFSchema;
  viewMode?: Action | null;
  formUiSchema?: UiSchema;
  formData?: Record<string, unknown> | null;
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
  overrideDefaults?: boolean;
}

const ModalFormSubmodule = (props: ModalFormSubmoduleProps) => {
  const { post, patch } = useDataProvider();

  const { execute: createItem, isPending: isLoadingCreation } = useQuery(
    (data: Record<string, unknown>) =>
      post({
        uri: `/${props.queryResource}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully created.");

        if (props.onSubmitSuccess) {
          props.onSubmitSuccess();
        }
      },
      onError: () => toast.error("Failed to create data."),
    }
  );

  const { execute: editItem, isPending: isLoadingEdit } = useQuery(
    (data: Record<string, unknown>) =>
      patch({
        uri: `/${props.queryResource}/${data.id}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully updated.");

        if (props.onSubmitSuccess) {
          props.onSubmitSuccess();
        }
      },
      onError: () => toast.error("Failed to edit data."),
    }
  );

  const handleFormSubmit = async (
    values: IChangeEvent<Record<string, unknown>>
  ) => {
    const fields = values.formData || {};

    if (props.viewMode === "creation") {
      await createItem(fields);
    }

    if (props.viewMode === "edit") {
      await editItem(fields);
    }
  };

  const formUiSchema = useMemo(() => {
    if (props.overrideDefaults) {
      return props.formUiSchema || {};
    }

    return Object.entries(defaultFormProps.formUiSchema).reduce(
      (currentSchema, currentItem) => {
        const itemKey = currentItem[0];

        if (props.formUiSchema && props.formUiSchema[itemKey]) {
          return {
            ...currentSchema,
            [itemKey]: { ...currentItem[1], ...props.formUiSchema[itemKey] },
          };
        }

        return {
          ...currentSchema,
          [itemKey]: currentItem[1],
        };
      },
      {}
    );
  }, [props.overrideDefaults, props.formUiSchema]);

  return (
    <Dialog
      open={props.viewMode !== null}
      maxWidth="lg"
      fullWidth
      onClose={props.onClose}
    >
      <DialogTitle>{props.title}</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={props.onClose}
        sx={{
          position: "absolute",
          right: (theme) => theme.spacing(1),
          top: (theme) => theme.spacing(1),
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <SchemaForm.Form
          schema={{
            ...defaultFormProps.formSchema,
            ...props.formSchema,
            required: props.overrideDefaults
              ? props.formSchema?.required || []
              : [
                  ...(defaultFormProps.formSchema.required || []),
                  ...(props.formSchema?.required || []),
                ],
            properties: props.overrideDefaults
              ? props.formSchema?.properties || {}
              : {
                  ...(defaultFormProps.formSchema.properties || {}),
                  ...(props.formSchema?.properties || {}),
                },
          }}
          uiSchema={{
            ...formUiSchema,
          }}
          validator={validator}
          onSubmit={handleFormSubmit}
          noHtml5Validate={true}
          showErrorList={false}
          formData={props.formData}
          readonly={props.viewMode === "details"}
          widgets={widgets}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            mt={4}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isLoadingCreation || isLoadingEdit}
              sx={{ mr: 1 }}
            >
              {isLoadingCreation || isLoadingEdit ? (
                <CircularProgress sx={{ color: "white" }} size={24} />
              ) : (
                props.submitButtonTitle || "Save"
              )}
            </Button>
            <Button variant="outlined" onClick={props.onClose} sx={{ ml: 1 }}>
              {props.cancelButtonTitle || "Close"}
            </Button>
          </Box>
        </SchemaForm.Form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFormSubmodule;
