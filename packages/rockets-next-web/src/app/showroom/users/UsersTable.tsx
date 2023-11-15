"use client";

import type { RowProps } from "@concepta/react-material-ui/dist/components/Table/types";
import { type FC, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Table, createTableStyles } from "@concepta/react-material-ui";
import { TableContainer, TableHead, TableBody, TableRow } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";
import EditIcon from "@mui/icons-material/Edit";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { headers } from "./tableConfig";
import type { FormData, ActionType } from "./types";

interface UsersTableProps {
  data: FormData[];
  onActionClick: ({
    rowData,
    action,
  }: {
    rowData: FormData;
    action: ActionType;
  }) => void;
}

const UsersTable: FC<UsersTableProps> = ({ data, onActionClick }) => {
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

  const getRowDataById = useCallback(
    (rowId: FormData["id"]) => {
      return data.find((item: FormData) => item.id === rowId);
    },
    [data]
  );

  const handleActionButtonClick = useCallback(
    (rowId: FormData["id"], action: ActionType) => {
      if (!getRowDataById(rowId)) {
        return;
      }

      onActionClick({
        rowData: getRowDataById(rowId) as FormData,
        action,
      });
    },
    [getRowDataById, onActionClick]
  );

  const customRows: RowProps[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((row) => {
      const { id, email, username } = row;

      return {
        id: id || "",
        email,
        username,
        actions: {
          component: (
            <Box>
              <IconButton
                onClick={() => handleActionButtonClick(row.id, "edit")}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleActionButtonClick(row.id, "delete")}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => handleActionButtonClick(row.id, "details")}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [data, handleActionButtonClick]);

  return (
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
  );
};

export default UsersTable;
