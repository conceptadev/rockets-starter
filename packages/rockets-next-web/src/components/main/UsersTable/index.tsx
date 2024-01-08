"use client";

import type {
  RowProps,
  HeaderProps,
  TableQueryStateProps,
} from "@concepta/react-material-ui/dist/components/Table/types";

import { useEffect, useMemo, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  ChevronRight as ChevronRightIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Filter } from "@concepta/react-material-ui";
import { FilterType } from "@concepta/react-material-ui/dist/components/Filter/Filter";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { toast } from "react-toastify";

import Table from "@/components/shared/Table";

import type { User, ActionType } from "@/types/User";

type BasicType = string | number | boolean;

type SimpleFilter = Record<string, BasicType | BasicType[] | null>;

type TableRootProps = {
  data: unknown[];
  isPending: boolean;
  error: unknown;
  total: number;
  pageCount: number;
  execute: () => void;
  refresh: () => void;
  simpleFilter: SimpleFilter;
  updateSimpleFilter: (
    simpleFilter: SimpleFilter | null,
    resetPage?: boolean
  ) => void;
  tableQueryState: TableQueryStateProps;
  setTableQueryState: React.Dispatch<
    React.SetStateAction<TableQueryStateProps>
  >;
};

type UsersTableProps = {
  headers: HeaderProps[];
  rows?: RowProps[];
  onActionClick: ({
    row,
    action,
  }: {
    row: User | null;
    action: ActionType;
  }) => void;
  tableProps: TableRootProps;
};

const UsersTable = ({
  headers,
  rows,
  onActionClick,
  tableProps,
}: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { del } = useDataProvider();

  const { execute: deleteUser } = useQuery(
    (id: User["id"]) =>
      del({
        uri: `/user/${id}`,
      }),
    false,
    {
      onSuccess: () => {
        tableProps.refresh();
        toast.success("User successfully deleted.");
      },
      onError: () => toast.error("Failed to delete user."),
    }
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    if (!term) {
      tableProps.updateSimpleFilter({
        email: null,
      });

      return;
    }

    const filter = {
      email: `||$contL||${term}||$or||username||$contL||${term}`,
    };

    tableProps.updateSimpleFilter(filter);
  };

  useEffect(() => {
    tableProps.refresh();
  }, [tableProps.simpleFilter]);

  const defaultRows: RowProps[] = useMemo(() => {
    const data = tableProps.data || [];

    return (data || []).map((row) => {
      const rowData = row as User;
      const { id, email, username } = rowData;

      return {
        id: id || "",
        email,
        username,
        actions: {
          component: (
            <Box>
              <IconButton
                onClick={() => onActionClick({ row: rowData, action: "edit" })}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteUser(rowData.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  onActionClick({ row: rowData, action: "details" })
                }
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [tableProps.data, onActionClick, deleteUser]);

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Box sx={{ width: "60%" }}>
          <Filter
            filters={[
              {
                type: FilterType.Text,
                defaultValue: searchTerm,
                placeholder: "Search user",
                onChange: handleSearchChange,
              },
            ]}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => onActionClick({ row: null, action: "creation" })}
        >
          Add new user
        </Button>
      </Box>

      <Table
        isPending={tableProps.isPending}
        isEmptyStateVisible={Boolean(searchTerm && !tableProps.data?.length)}
        headers={headers}
        rows={rows ?? defaultRows}
        data={tableProps.data}
        tableQueryState={tableProps.tableQueryState}
        updateTableQueryState={tableProps.setTableQueryState}
        total={tableProps.total}
        pageCount={tableProps.pageCount}
      />
    </>
  );
};

export default UsersTable;
