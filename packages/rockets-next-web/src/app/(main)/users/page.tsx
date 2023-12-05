"use client";

import { type FC, useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { Text } from "@concepta/react-material-ui";
import { TextField } from "@concepta/react-material-ui";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";

import UsersTable from "./UsersTable";
import UserForm from "./UserForm";
import type { ActionType } from "./types";

import type { User } from "@/types/User";

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
  const [selectedRow, setSelectedRow] = useState<User | null>();

  const [debouncedSearch] = useDebounce(searchTerm, 1000);

  const { del } = useDataProvider();

  const {
    data,
    total,
    isPending: isLoadingUsers,
    pageCount,
    tableQueryState,
    setTableQueryState,
    execute: fetchUsers,
    search: innerSearch,
  } = useTable("user", {
    search: JSON.stringify({
      email: { $contL: debouncedSearch.toLowerCase() },
    }),
    callbacks: {
      onError: () => toast.error("Failed to fetch users."),
    },
  });

  const { execute: deleteUser } = useQuery(
    (id: User["id"]) =>
      del({
        uri: `/user/${id}`,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("User successfully deleted.");
        fetchUsers();
      },
      onError: () => toast.error("Failed to delete user."),
    }
  );

  const deleteRow = useCallback(
    async (rowId: User["id"]) => {
      await deleteUser(rowId);
      resetDrawerState();
    },
    [deleteUser]
  );

  const handleTableRowAction = ({
    rowData,
    action,
  }: {
    rowData: User;
    action: ActionType;
  }) => {
    if (action === "delete") {
      deleteRow(rowData.id);
      return;
    }

    setSelectedRow(rowData);
    setDrawerState({ viewMode: action, isOpen: true });
  };

  const resetDrawerState = () => {
    setSelectedRow(null);
    setDrawerState({ viewMode: null, isOpen: false });
  };

  const handleFormSubmitSuccess = () => {
    fetchUsers();
    resetDrawerState();
  };

  useEffect(() => {
    fetchUsers();
  }, [innerSearch]);

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

      <UsersTable
        isLoading={isLoadingUsers}
        isEmptyStateVisible={Boolean(searchTerm && !data?.length)}
        data={data as User[]}
        tableQueryState={tableQueryState}
        updateTableQueryState={setTableQueryState}
        total={total}
        pageCount={pageCount}
        onActionClick={handleTableRowAction}
      />

      <Drawer open={drawerState.isOpen} anchor="right">
        <Box padding={4} mb={2}>
          <UserForm
            selectedRow={selectedRow}
            viewMode={drawerState.viewMode}
            onSubmitSuccess={handleFormSubmitSuccess}
            onCancel={resetDrawerState}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default UsersScreen;
