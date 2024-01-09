import type {
  HeaderProps,
  RowProps,
} from "@concepta/react-material-ui/dist/components/Table/types";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";

import { useState, useMemo, useEffect } from "react";
import { Box, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import useTable from "@concepta/react-material-ui/dist/components/Table/useTable";
import { toast } from "react-toastify";

import TableFilter from "@/components/shared/TableFilter";
import Table from "@/components/shared/Table";
import DrawerForm from "@/components/shared/DrawerForm";

type Action = "creation" | "edit" | "details" | null;

type SelectedRow = Record<string, unknown> | null;

interface ModuleProps {
  resource: string;
  tableSchema: HeaderProps[];
  formSchema: RJSFSchema;
  formUiSchema?: UiSchema;
}

const Module = (props: ModuleProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerViewMode, setDrawerViewMode] = useState<Action>(null);
  const [selectedRow, setSelectedRow] = useState<SelectedRow>(null);

  const tableProps = useTable(props.resource, {
    callbacks: {
      onError: () => toast.error("Failed to fetch data."),
    },
  });

  const { del, post, patch } = useDataProvider();

  const { execute: createItem, isPending: isLoadingCreation } = useQuery(
    (data: Record<string, unknown>) =>
      post({
        uri: `/${props.resource}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully created.");
        setDrawerViewMode(null);
        setSelectedRow(null);
        tableProps.refresh();
      },
      onError: () => toast.error("Failed to create data."),
    }
  );

  const { execute: editItem, isPending: isLoadingEdit } = useQuery(
    (data: Record<string, unknown>) =>
      patch({
        uri: `/${props.resource}/${data.id}`,
        body: data,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully updated.");
        setDrawerViewMode(null);
        setSelectedRow(null);
        tableProps.refresh();
      },
      onError: () => toast.error("Failed to edit data."),
    }
  );

  const { execute: deleteItem } = useQuery(
    (id: string | number) =>
      del({
        uri: `/${props.resource}/${id}`,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully deleted.");
        tableProps.refresh();
      },
      onError: () => toast.error("Failed to delete data."),
    }
  );

  const handleFormSubmit = async (values: Record<string, unknown>) => {
    if (drawerViewMode === "creation") {
      await createItem(values);
    }

    if (drawerViewMode === "edit") {
      await editItem(values);
    }
  };

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

  const tableRows: RowProps[] = useMemo(() => {
    const data = tableProps.data || [];

    return data.map((row: any) => {
      return {
        ...row,
        actions: {
          component: (
            <Box>
              <IconButton
                onClick={() => {
                  setDrawerViewMode("edit");
                  setSelectedRow(row);
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(row.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  setDrawerViewMode("details");
                  setSelectedRow(row);
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [tableProps.data, deleteItem]);

  useEffect(() => {
    tableProps.refresh();
  }, [tableProps.simpleFilter]);

  return (
    <Box>
      <TableFilter
        value={searchTerm}
        onSearchChange={handleSearchChange}
        onAddNew={() => {
          setSelectedRow(null);
          setDrawerViewMode("creation");
        }}
      />

      <Table
        isPending={tableProps.isPending}
        isEmptyStateVisible={Boolean(searchTerm && !tableProps.data?.length)}
        headers={props.tableSchema}
        rows={tableRows}
        data={tableProps.data}
        tableQueryState={tableProps.tableQueryState}
        updateTableQueryState={tableProps.setTableQueryState}
        total={tableProps.total}
        pageCount={tableProps.pageCount}
      />

      <DrawerForm
        isLoading={isLoadingCreation || isLoadingEdit}
        formSchema={props.formSchema}
        formUiSchema={props.formUiSchema}
        viewMode={drawerViewMode}
        formData={selectedRow}
        onFormSubmit={handleFormSubmit}
        onClose={() => {
          setSelectedRow(null);
          setDrawerViewMode(null);
        }}
      />
    </Box>
  );
};

export default Module;
