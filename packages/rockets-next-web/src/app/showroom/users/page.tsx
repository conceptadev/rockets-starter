"use client";

import type { FC } from "react";
import type { RowProps } from "@concepta/react-material-ui/dist/components/Table/types";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import { Table, Text, createTableStyles } from "@concepta/react-material-ui";
import { TableContainer, TableHead, TableBody, TableRow } from "@mui/material";
import useTheme from "@mui/material/styles/useTheme";

import { CustomNameCell, CustomStatusCell } from "./CustomCells";
import { rows, headers } from "./fakeData";

const UsersScreen: FC = () => {
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
        role,
        lastLogin,
      };
    });
  }, []);

  return (
    <Box>
      <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
        Users table with CRUD operations
      </Text>

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
    </Box>
  );
};

export default UsersScreen;
