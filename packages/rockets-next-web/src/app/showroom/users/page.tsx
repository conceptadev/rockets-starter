"use client";

import type { IChangeEvent } from "@rjsf/core";
import { type FC, useState, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { SchemaForm } from "@concepta/react-material-ui";
import { Text } from "@concepta/react-material-ui";
import { TextField } from "@concepta/react-material-ui";
import validator from "@rjsf/validator-ajv6";
import UsersTable, { type ActionType } from "./UsersTable";
import {
  type FormData,
  schema,
  uiSchema,
  widgets,
  validate,
} from "./formConfig";

interface DrawerState {
  isOpen: boolean;
  viewMode: ActionType;
}

const UsersScreen: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    viewMode: null,
  });
  const [selectedRow, setSelectedRow] = useState<FormData | null>();

  const { get, post, patch, del } = useDataProvider();

  const { data, execute: fetchUsers } = useQuery(
    () =>
      get({
        uri: `/user`,
      }),
    true,
    {
      onError: (error) => console.error(error),
    }
  );

  const { execute: createUser } = useQuery(
    (data: FormData) =>
      post({
        uri: `/user`,
        body: data,
      }),
    false,
    {
      onSuccess: () => fetchUsers(),
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
      onSuccess: () => fetchUsers(),
      onError: (error) => console.error(error),
    }
  );

  const { execute: deleteUser } = useQuery(
    (id: FormData["id"]) =>
      del({
        uri: `/user/${id}`,
      }),
    false,
    {
      onSuccess: () => fetchUsers(),
      onError: (error) => console.error(error),
    }
  );

  const deleteRow = useCallback(
    async (rowId: FormData["id"]) => {
      await deleteUser(rowId);
      resetDrawerState();
    },
    [deleteUser]
  );

  const handleTableRowAction = ({
    rowData,
    action,
  }: {
    rowData: FormData;
    action: ActionType;
  }) => {
    if (action === "delete") {
      deleteRow(rowData.id);
      return;
    }

    setSelectedRow(rowData);
    setDrawerState({ viewMode: action, isOpen: true });
  };

  const handleFormSubmit = async (values: IChangeEvent<FormData>) => {
    const fields = values.formData;

    if (!fields) {
      return;
    }

    if (drawerState.viewMode === "creation") {
      await createUser(fields);
    }

    if (drawerState.viewMode === "edit") {
      await editUser(fields);
    }

    resetDrawerState();
  };

  const resetDrawerState = () => {
    setSelectedRow(null);
    setDrawerState({ viewMode: null, isOpen: false });
  };

  return (
    <Box>
      <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
        Users
      </Text>

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <TextField
          variant="outlined"
          placeholder="Search user"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() =>
            setDrawerState({
              viewMode: "creation",
              isOpen: true,
            })
          }
        >
          Add new user
        </Button>
      </Box>

      <UsersTable data={data} onActionClick={handleTableRowAction} />

      <Drawer open={drawerState.isOpen} anchor="right">
        <Box padding={4} mb={2}>
          <SchemaForm.Form
            schema={schema}
            uiSchema={uiSchema}
            validator={validator}
            onSubmit={handleFormSubmit}
            widgets={widgets}
            customValidate={validate}
            noHtml5Validate={true}
            showErrorList={false}
            formData={selectedRow}
            readonly={drawerState.viewMode === "details"}
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
                disabled={drawerState.viewMode === "details"}
                sx={{ flex: 1, mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={resetDrawerState}
                sx={{ flex: 1, ml: 1 }}
              >
                Close
              </Button>
            </Box>
          </SchemaForm.Form>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UsersScreen;
