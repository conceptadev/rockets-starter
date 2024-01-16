import type { HeaderProps } from "@concepta/react-material-ui/dist/components/Table/types";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import { useState } from "react";
import { Box } from "@mui/material";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";
import { toast } from "react-toastify";

import TableSubmodule from "@/components/Submodules/Table";
import DrawerFormSubmodule from "@/components/Submodules/DrawerForm";

import { defaultTableProps, defaultDrawerFormProps } from "./constants";

type Action = "creation" | "edit" | "details" | null;

type SelectedRow = Record<string, unknown> | null;

interface TableProps {
  tableSchema?: HeaderProps[];
  searchParam?: string;
}

interface DrawerFormProps {
  formSchema?: RJSFSchema;
  formUiSchema?: UiSchema;
}

interface ModuleProps {
  resource: string;
  tableProps?: TableProps;
  drawerFormProps?: DrawerFormProps;
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
        {...defaultTableProps}
        {...props.tableProps}
      />

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
        {...defaultDrawerFormProps}
        {...props.drawerFormProps}
      />
    </Box>
  );
};

export default CrudModule;