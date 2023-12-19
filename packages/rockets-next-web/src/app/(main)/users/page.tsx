"use client";

import { type FC, useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { Text, Filter } from "@concepta/react-material-ui";
import { toast } from "react-toastify";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";
import { FilterType } from "@concepta/react-material-ui/dist/components/Filter/Filter";

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

  const { del } = useDataProvider();

  const {
    data,
    total,
    isPending: isLoadingUsers,
    pageCount,
    tableQueryState,
    setTableQueryState,
    execute: fetchUsers,
    search,
    updateSearch,
  } = useTable("user", {
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

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    if (!term) {
      updateSearch({ $or: null });

      return;
    }

    const search = {
      $or: [{ email: { $contL: term } }, { username: { $contL: term } }],
    };

    updateSearch(search);
  };

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
  }, [search]);

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
