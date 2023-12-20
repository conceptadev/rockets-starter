"use client";

import type { RowProps } from "@concepta/react-material-ui/dist/components/Table/types";
import { useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";

import Table from "@/components/Table/Table";

import { headers } from "./tableConfig";

import type { User, ActionType } from "@/types/User";
import type { TableRootProps } from "@/types/Table";

type UsersTableProps = {
  isLoading?: boolean;
  isEmptyStateVisible?: boolean;
  data: User[];
  onActionClick: ({
    rowData,
    action,
  }: {
    rowData: User;
    action: ActionType;
  }) => void;
} & Omit<TableRootProps, "rows" | "headers">;

const UsersTable = ({
  isLoading,
  isEmptyStateVisible,
  data,
  onActionClick,
  ...tableRootProps
}: UsersTableProps) => {
  const handleActionButtonClick = useCallback(
    (rowData: User, action: ActionType) =>
      onActionClick({ rowData: rowData, action }),
    [onActionClick]
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
              <IconButton onClick={() => handleActionButtonClick(row, "edit")}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleActionButtonClick(row, "delete")}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => handleActionButtonClick(row, "details")}
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
    <Table
      rows={customRows}
      headers={headers}
      data={data}
      isEmptyStateVisible={isEmptyStateVisible}
      isPending={Boolean(isLoading)}
      {...tableRootProps}
    />
  );
};

export default UsersTable;
