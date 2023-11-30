"use client";

import type {
  HeaderProps,
  RowProps,
} from "@concepta/react-material-ui/dist/components/Table/types";
import type { FC } from "react";
import {
  Table as RocketsTable,
  createTableStyles,
} from "@concepta/react-material-ui";
import {
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
} from "@mui/material";

interface TableProps {
  rows: RowProps[];
  headers: HeaderProps[];
  isLoading?: boolean;
  isEmptyStateVisible?: boolean;
}

const Table: FC<TableProps> = ({
  rows,
  headers,
  isLoading,
  isEmptyStateVisible,
}) => {
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

  return (
    <RocketsTable.Root rows={rows} headers={headers} sx={tableTheme.root}>
      <TableContainer sx={tableTheme.tableContainer}>
        <RocketsTable.Table
          stickyHeader
          variant="outlined"
          sx={tableTheme.table}
        >
          <TableHead>
            <TableRow sx={tableTheme.tableRow}>
              <RocketsTable.HeaderCells />
            </TableRow>
          </TableHead>
          <TableBody>
            {isEmptyStateVisible && (
              <TableRow>
                <TableCell
                  colSpan={headers.length}
                  sx={{
                    textAlign: "center",
                  }}
                >
                  No records found.
                </TableCell>
              </TableRow>
            )}
            <RocketsTable.BodyRows isLoading={isLoading} />
          </TableBody>
        </RocketsTable.Table>
      </TableContainer>
      <RocketsTable.Pagination variant="outlined" />
    </RocketsTable.Root>
  );
};

export default Table;
