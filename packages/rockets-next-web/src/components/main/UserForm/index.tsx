"use client";

import type { IChangeEvent } from "@rjsf/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { SchemaForm } from "@concepta/react-material-ui";
import validator from "@rjsf/validator-ajv6";
import { toast } from "react-toastify";

import { schema, widgets, getUiSchemaByViewMode } from "@/forms/user";

import type { User, ActionType } from "@/types/User";

interface UserFormProps {
  selectedRow?: User | null;
  viewMode: ActionType;
  onSubmitSuccess: () => void;
  onCancel: () => void;
}

const UserForm = ({
  selectedRow,
  viewMode,
  onSubmitSuccess,
  onCancel,
}: UserFormProps) => {
  const { post, patch } = useDataProvider();

  const { execute: createUser, isPending: isLoadingUserCreation } = useQuery(
    (data: User) =>
      post({
        uri: `/user`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("User successfully created.");
        onSubmitSuccess();
      },
      onError: () => toast.error("Failed to create user."),
    }
  );

  const { execute: editUser, isPending: isLoadingUserEdit } = useQuery(
    (data: User) =>
      patch({
        uri: `/user/${data.id}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("User successfully updated.");
        onSubmitSuccess();
      },
      onError: () => toast.error("Failed to edit user."),
    }
  );

  const handleFormSubmit = async (values: IChangeEvent<User>) => {
    const fields = values.formData;

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
      uiSchema={getUiSchemaByViewMode(viewMode)}
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
          disabled={
            viewMode === "details" || isLoadingUserCreation || isLoadingUserEdit
          }
          sx={{ flex: 1, mr: 1 }}
        >
          {isLoadingUserCreation || isLoadingUserEdit ? (
            <CircularProgress sx={{ color: "white" }} size={24} />
          ) : (
            "Save"
          )}
        </Button>
        <Button variant="outlined" onClick={onCancel} sx={{ flex: 1, ml: 1 }}>
          Close
        </Button>
      </Box>
    </SchemaForm.Form>
  );
};

export default UserForm;
