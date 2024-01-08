"use client";

import type {
  RowProps,
  HeaderProps,
} from "@concepta/react-material-ui/dist/components/Table/types";
import type { RJSFSchema } from "@rjsf/utils";

import { useState } from "react";
import { Box, Drawer } from "@mui/material";
import { Text } from "@concepta/react-material-ui";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";
import { toast } from "react-toastify";

import UsersTable from "@/components/main/UsersTable";
import UserForm from "@/components/main/UserForm";

import type { User, ActionType } from "@/types/User";

type DrawerState = {
  isOpen: boolean;
  viewMode: ActionType;
};

type UsersModuleProps = {
  title?: string;
  headers?: HeaderProps[];
  rows?: RowProps[];
  formSchema?: RJSFSchema;
};

const defaultHeaders = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Username",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

const UsersModule = (props: Partial<UsersModuleProps>) => {
  const [selectedRow, setSelectedRow] = useState<User | null>();
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    viewMode: null,
  });

  const tableProps = useTable("user", {
    callbacks: {
      onError: () => toast.error("Failed to fetch users."),
    },
  });

  const resetDrawerState = () => {
    setSelectedRow(null);
    setDrawerState({ viewMode: null, isOpen: false });
  };

  const handleRowAction = async ({
    row,
    action,
  }: {
    row: User | null;
    action: ActionType;
  }) => {
    setSelectedRow(row);
    setDrawerState({ viewMode: action, isOpen: true });
  };

  const handleRefreshUsers = () => {
    resetDrawerState();
    tableProps.refresh();
  };

  return (
    <Box>
      <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
        {props.title || "Users"}
      </Text>

      <UsersTable
        headers={props.headers || defaultHeaders}
        rows={props.rows}
        onActionClick={handleRowAction}
        tableProps={tableProps}
      />

      <Drawer open={drawerState.isOpen} anchor="right">
        <Box padding={4} mb={2}>
          <UserForm
            formSchema={props.formSchema}
            selectedRow={selectedRow}
            viewMode={drawerState.viewMode}
            onSubmitSuccess={handleRefreshUsers}
            onCancel={resetDrawerState}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default UsersModule;
