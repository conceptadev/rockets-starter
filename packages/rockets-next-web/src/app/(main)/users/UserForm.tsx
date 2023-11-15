"use client";

import type { IChangeEvent } from "@rjsf/core";
import { type FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { SchemaForm } from "@concepta/react-material-ui";
import validator from "@rjsf/validator-ajv6";
import { schema, uiSchema, widgets } from "./formConfig";
import type { FormData, ActionType } from "./types";

interface UserFormProps {
  selectedRow?: FormData | null;
  viewMode: ActionType;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const UserForm: FC<UserFormProps> = ({
  selectedRow,
  viewMode,
  onSubmitSuccess,
  onCancel,
}) => {
  const { post, patch } = useDataProvider();

  const { execute: createUser } = useQuery(
    (data: FormData) =>
      post({
        uri: `/user`,
        body: data,
      }),
    false,
    {
      onSuccess: onSubmitSuccess,
      onError: (error) => console.error(error),
    }
  );

  const { execute: editUser } = useQuery(
    (data: FormData) =>
      patch({
        uri: `/user/${data.id}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => onSubmitSuccess,
      onError: (error) => console.error(error),
    }
  );

  const handleFormSubmit = async (values: IChangeEvent<FormData>) => {
    const fields = values.formData;

    if (!fields) {
      return;
    }

    if (viewMode === "creation") {
      await createUser(fields);
    }

    if (viewMode === "edit") {
      await editUser(fields);
    }
  };

  return (
    <SchemaForm.Form
      schema={schema}
      uiSchema={uiSchema}
      validator={validator}
      onSubmit={handleFormSubmit}
      widgets={widgets}
      noHtml5Validate={true}
      showErrorList={false}
      formData={selectedRow}
      readonly={viewMode === "details"}
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
          disabled={viewMode === "details"}
          sx={{ flex: 1, mr: 1 }}
        >
          Save
        </Button>
        <Button variant="outlined" onClick={onCancel} sx={{ flex: 1, ml: 1 }}>
          Close
        </Button>
      </Box>
    </SchemaForm.Form>
  );
};

export default UserForm;
