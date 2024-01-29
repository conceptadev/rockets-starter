import type { HeaderProps } from "@concepta/react-material-ui/dist/components/Table/types";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import { useState } from "react";
import { Box } from "@mui/material";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";
import { toast } from "react-toastify";
import { Text } from "@concepta/react-material-ui";

import TableSubmodule from "@/components/submodules/Table";
import DrawerFormSubmodule from "@/components/submodules/DrawerForm";
import ModalFormSubmodule from "@/components/submodules/ModalForm";

type Action = "creation" | "edit" | "details" | null;

type SelectedRow = Record<string, unknown> | null;

type TableSchemaItem = HeaderProps & {
  format?: (data: string | number) => string | number;
};

interface TableProps {
  tableSchema?: TableSchemaItem[];
  searchParam?: string;
  hideActionsColumn?: boolean;
  overrideDefaults?: boolean;
}

interface FormProps {
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  overrideDefaults?: boolean;
}

interface ModuleProps {
  title?: string;
  resource: string;
  tableProps?: TableProps;
  variation?: "drawer" | "modal";
  formProps?: FormProps;
}

const CrudModule = (props: ModuleProps) => {
  const [drawerViewMode, setDrawerViewMode] = useState<Action>(null);
  const [selectedRow, setSelectedRow] = useState<SelectedRow>(null);

  const tableProps = useTable(props.resource, {
    callbacks: {
      onError: () => toast.error("Failed to fetch data."),
    },
  });

  return (
    <Box>
      {props.title ? (
        <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
          {props.title}
        </Text>
      ) : null}

      <TableSubmodule
        queryResource={props.resource}
        onAction={(payload) => {
          setSelectedRow(payload.row);
          setDrawerViewMode(payload.action);
        }}
        onAddNew={() => {
          setSelectedRow(null);
          setDrawerViewMode("creation");
        }}
        {...tableProps}
        {...props.tableProps}
      />

      {!props.variation || props.variation === "drawer" ? (
        <DrawerFormSubmodule
          queryResource={props.resource}
          viewMode={drawerViewMode}
          formData={selectedRow}
          onSubmitSuccess={() => {
            tableProps.refresh();
            setSelectedRow(null);
            setDrawerViewMode(null);
          }}
          onClose={() => {
            setSelectedRow(null);
            setDrawerViewMode(null);
          }}
          {...props.formProps}
        />
      ) : null}

      {props.variation === "modal" ? (
        <ModalFormSubmodule
          title={
            drawerViewMode === "creation"
              ? "New user"
              : drawerViewMode === "edit"
              ? "Edit user"
              : drawerViewMode === "details"
              ? "User details"
              : ""
          }
          queryResource={props.resource}
          viewMode={drawerViewMode}
          formData={selectedRow}
          onSubmitSuccess={() => {
            tableProps.refresh();
            setSelectedRow(null);
            setDrawerViewMode(null);
          }}
          onClose={() => {
            setSelectedRow(null);
            setDrawerViewMode(null);
          }}
          {...props.formProps}
        />
      ) : null}
    </Box>
  );
};

export default CrudModule;
