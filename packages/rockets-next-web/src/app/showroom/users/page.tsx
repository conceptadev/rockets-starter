"use client";

import type { RowProps } from "@concepta/react-material-ui/dist/components/Table/types";
import type { IChangeEvent } from "@rjsf/core";
import { type FC, useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { SchemaForm } from "@concepta/react-material-ui";
import { Table, Text, createTableStyles } from "@concepta/react-material-ui";
import { TextField } from "@concepta/react-material-ui";
import { TableContainer, TableHead, TableBody, TableRow } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import validator from "@rjsf/validator-ajv6";
import EditIcon from "@mui/icons-material/Edit";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { headers } from "./tableConfig";
import {
  type FormData,
  schema,
  uiSchema,
  widgets,
  validate,
} from "./formConfig";

enum DRAWER_VIEW_MODE {
  CREATION = "CREATION",
  EDIT = "EDIT",
  DETAILS = "DETAILS",
}

interface DrawerState {
  isOpen: boolean;
  viewMode: DRAWER_VIEW_MODE | null;
}

const UsersScreen: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    viewMode: null,
  });
  const [currentRow, setCurrentRow] = useState<FormData>();

  const theme = useTheme();

  const { get, post, patch, del } = useDataProvider();

  const getUsers = () =>
    get({
      uri: `/user`,
    });

  const { data, execute: fetchUsers } = useQuery(getUsers, true, {
    onError: (error) => console.error(error),
  });

  const createUser = (data: FormData) =>
    post({
      uri: `/user`,
      body: data,
    });

  const { execute: createNewUser } = useQuery(createUser, false, {
    onError: (error) => console.error(error),
  });

  const editUser = (data: FormData) =>
    patch({
      uri: `/user/${data.id}`,
      body: data,
    });

  const { execute: editExistingUser } = useQuery(editUser, false, {
    onError: (error) => console.error(error),
  });

  const deleteUser = (id: FormData["id"]) =>
    del({
      uri: `/user/${id}`,
    });

  const { execute: deleteExistingUser } = useQuery(deleteUser, false, {
    onError: (error) => console.error(error),
  });

  const tableTheme = createTableStyles({
    table: {
      height: "100%",
    },
    root: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      overflow: "auto",
    },
    tableHeader: {
      ...theme.typography.caption,
      lineHeight: 1,
      fontWeight: 500,
      color: theme.palette.grey[500],
    },
    tableRow: {
      backgroundColor: "#F9FAFB",
      textTransform: "uppercase",
    },
    tableContainer: {
      flex: 1,
    },
  });

  const getRowDataById = useCallback(
    (rowId: FormData["id"]) => {
      return data.find((item: FormData) => item.id === rowId);
    },
    [data]
  );

  const editRow = useCallback(
    (rowId: FormData["id"]) => {
      if (!getRowDataById(rowId)) {
        return;
      }

      setCurrentRow(getRowDataById(rowId) as FormData);
      setDrawerState({ viewMode: DRAWER_VIEW_MODE.EDIT, isOpen: true });
    },
    [getRowDataById]
  );

  const viewRow = useCallback(
    (rowId: FormData["id"]) => {
      if (!getRowDataById(rowId)) {
        return;
      }

      setCurrentRow(getRowDataById(rowId) as FormData);
      setDrawerState({ viewMode: DRAWER_VIEW_MODE.DETAILS, isOpen: true });
    },
    [getRowDataById]
  );

  const deleteRow = useCallback(
    async (rowId: FormData["id"]) => {
      await deleteExistingUser(rowId);
      fetchUsers();
      resetDrawerState();
    },
    [deleteExistingUser, fetchUsers]
  );

  const handleFormSubmit = async (values: IChangeEvent<FormData>) => {
    const fields = values.formData;

    if (!fields) {
      return;
    }

    if (drawerState.viewMode === DRAWER_VIEW_MODE.CREATION) {
      await createNewUser(fields);
    }

    if (drawerState.viewMode === DRAWER_VIEW_MODE.EDIT) {
      await editExistingUser(fields);
    }

    await fetchUsers();
    resetDrawerState();
  };

  const resetDrawerState = () => {
    setCurrentRow(undefined);
    setDrawerState({ viewMode: null, isOpen: false });
  };

  const customRows: RowProps[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((row: FormData) => {
      const { id, email, username } = row;

      return {
        id,
        email,
        username,
        actions: {
          component: (
            <Box>
              <IconButton onClick={() => editRow(row.id)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteRow(row.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={() => viewRow(row.id)}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [data, editRow, viewRow, deleteRow]);

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
              viewMode: DRAWER_VIEW_MODE.CREATION,
              isOpen: true,
            })
          }
        >
          Add new user
        </Button>
      </Box>

      <Table.Root rows={customRows} headers={headers} sx={tableTheme.root}>
        <TableContainer sx={tableTheme.tableContainer}>
          <Table.Table stickyHeader variant="outlined" sx={tableTheme.table}>
            <TableHead>
              <TableRow sx={tableTheme.tableRow}>
                <Table.HeaderCells />
              </TableRow>
            </TableHead>
            <TableBody>
              <Table.BodyRows
                renderRow={(row) => (
                  <Table.BodyRow row={row}>
                    <Table.BodyCell row={row} />
                  </Table.BodyRow>
                )}
              />
            </TableBody>
          </Table.Table>
        </TableContainer>
        <Table.Pagination variant="outlined" />
      </Table.Root>

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
            formData={currentRow}
            readonly={drawerState.viewMode === DRAWER_VIEW_MODE.DETAILS}
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
                disabled={drawerState.viewMode === DRAWER_VIEW_MODE.DETAILS}
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
