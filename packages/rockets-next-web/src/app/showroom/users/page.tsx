"use client";

import type { FC } from "react";
import type { RowProps } from "@concepta/react-material-ui/dist/components/Table/types";
import type { IChangeEvent } from "@rjsf/core";

import { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { Table, Text, createTableStyles } from "@concepta/react-material-ui";
import { TextField } from "@concepta/react-material-ui";
import { TableContainer, TableHead, TableBody, TableRow } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv6";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import {
  CustomNameCell,
  CustomRoleCell,
  CustomStatusCell,
} from "./CustomCells";
import { rows, headers } from "./fakeData";
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

  const handleSelectRow = useCallback((rowId: FormData["id"]) => {
    const rowData = rows.find((item) => item.id === rowId);

    if (!rowData) {
      return;
    }

    setCurrentRow(rowData as FormData);
    setDrawerState({ viewMode: DRAWER_VIEW_MODE.DETAILS, isOpen: true });
  }, []);

  const handleFormSubmit = (values: IChangeEvent<FormData>) => {
    const fields = values.formData;

    if (!fields) {
      return;
    }

    setDrawerState({ viewMode: null, isOpen: false });
  };

  const resetDrawerState = () => {
    setCurrentRow(undefined);
    setDrawerState({ viewMode: null, isOpen: false });
  };

  const customRows: RowProps[] = useMemo(() => {
    return rows.map((row) => {
      const { id, name, email, status, role, lastLogin } = row;

      return {
        id,
        name: {
          sortableValue: name,
          component: <CustomNameCell name={name} email={email} />,
        },
        status: {
          sortableValue: status,
          component: <CustomStatusCell status={status} />,
        },
        role: {
          sortableValue: role,
          component: <CustomRoleCell role={role} />,
        },
        lastLogin,
        actions: {
          component: (
            <Button onClick={() => handleSelectRow(row.id)}>
              <ChevronRightIcon />
            </Button>
          ),
        },
      };
    });
  }, [handleSelectRow]);

  return (
    <Box>
      <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
        Users table with CRUD operations
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
        <Box padding={4}>
          <Box mb={2}>
            <Form
              schema={schema}
              uiSchema={uiSchema}
              validator={validator}
              onSubmit={handleFormSubmit}
              widgets={widgets}
              customValidate={validate}
              noHtml5Validate={true}
              showErrorList={false}
              onError={(err) =>
                // eslint-disable-next-line no-console
                console.log("errors", err)
              }
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
            </Form>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default UsersScreen;
