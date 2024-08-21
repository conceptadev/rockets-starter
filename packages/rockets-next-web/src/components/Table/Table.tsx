import type { FC } from "react";
import {
  Table as RocketsTable,
  createTableStyles,
} from "@concepta/react-material-ui/";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

import { TableRootProps } from "@/types/Table";

type TableProps = {
  isPending: boolean;
  data: unknown[];
  isEmptyStateVisible?: boolean;
} & TableRootProps;

const Table: FC<TableProps> = ({
  rows,
  headers,
  isPending,
  isEmptyStateVisible,
  ...tableRootProps
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
    <RocketsTable.Root
      rows={rows}
      headers={headers}
      sx={tableTheme.root}
      {...tableRootProps}
    >
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
            <RocketsTable.BodyRows isLoading={isPending} />
          </TableBody>
        </RocketsTable.Table>
      </TableContainer>
      <RocketsTable.Pagination variant="outlined" />
    </RocketsTable.Root>
  );
};

export default Table;
