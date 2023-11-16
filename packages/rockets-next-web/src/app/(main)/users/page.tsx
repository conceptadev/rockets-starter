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

import UsersTable from "./UsersTable";
import UserForm from "./UserForm";
import type { FormData, ActionType } from "./types";

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

  const [debouncedSearch] = useDebounce(searchTerm, 1000);

  const { get, del } = useDataProvider();

  const {
    isPending: isLoadingUsers,
    data,
    execute: fetchUsers,
  } = useQuery(
    (search?: string) =>
      get({
        uri: search
          ? `/user?or=email||$contL||${search}&or=username||$contL||${search}`
          : "/user",
      }),
    false,
    {
      onError: () => toast.error("Failed to fetch users."),
    }
  );

  const { execute: deleteUser } = useQuery(
    (id: FormData["id"]) =>
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

  const resetDrawerState = () => {
    setSelectedRow(null);
    setDrawerState({ viewMode: null, isOpen: false });
  };

  const handleFormSubmitSuccess = () => {
    fetchUsers();
    resetDrawerState();
  };

  useEffect(() => {
    fetchUsers(debouncedSearch);
  }, [debouncedSearch]);

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
        data={data}
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
