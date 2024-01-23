import type {
  HeaderProps,
  RowProps,
  TableQueryStateProps,
} from "@concepta/react-material-ui/dist/components/Table/types";

import { useState, useMemo } from "react";
import { Box, Button, IconButton } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
import { Filter } from "@concepta/react-material-ui";
import { FilterType } from "@concepta/react-material-ui/dist/components/Filter/Filter";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import { toast } from "react-toastify";

import Table from "@/components/Table";

import { defaultTableProps } from "@/components/CrudModule/constants";

type Action = "creation" | "edit" | "details" | null;

type BasicType = string | number | boolean;

type SimpleFilter = Record<string, BasicType | BasicType[] | null>;

type ActionCallbackPayload = {
  action: Action;
  row: Record<string, unknown>;
};

type TableSchemaItem = HeaderProps & {
  format?: (data: string | number) => string | number;
};

interface TableSubmoduleProps {
  queryResource: string;
  tableSchema?: TableSchemaItem[];
  onAction?: ({ action, row }: ActionCallbackPayload) => void;
  onAddNew?: () => void;
  refresh: () => void;
  data: unknown[];
  isPending: boolean;
  total: number;
  pageCount: number;
  simpleFilter: SimpleFilter;
  updateSimpleFilter: (
    simpleFilter: SimpleFilter | null,
    resetPage?: boolean
  ) => void;
  tableQueryState: TableQueryStateProps;
  setTableQueryState: React.Dispatch<
    React.SetStateAction<TableQueryStateProps>
  >;
  searchParam?: string;
  hideActionsColumn?: boolean;
  overrideDefaults?: boolean;
}

const TableSubmodule = (props: TableSubmoduleProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const { del } = useDataProvider();

  const { execute: deleteItem } = useQuery(
    (id: string | number) =>
      del({
        uri: `/${props.queryResource}/${id}`,
      }),
    false,
    {
      onSuccess: () => {
        toast.success("Data successfully deleted.");

        if (props.refresh) {
          props.refresh();
        }
      },
      onError: () => toast.error("Failed to delete data."),
    }
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    if (!props.updateSimpleFilter) {
      return;
    }

    if (!term) {
      props.updateSimpleFilter(
        {
          [props.searchParam || defaultTableProps.searchParam]: null,
        },
        true
      );

      return;
    }

    const filter = {
      [props.searchParam || defaultTableProps.searchParam]: `||$contL||${term}`,
    };

    props.updateSimpleFilter(filter, true);
  };

  const tableHeaders: TableSchemaItem[] = useMemo(() => {
    let headers: TableSchemaItem[] = [];

    if (!props.overrideDefaults && !props.tableSchema) {
      headers = defaultTableProps.tableSchema;
    }

    if (props.overrideDefaults && props.tableSchema) {
      headers = props.tableSchema;
    }

    if (!props.overrideDefaults && props.tableSchema) {
      headers = [...defaultTableProps.tableSchema, ...props.tableSchema];
    }

    return [
      ...headers,
      { id: !props.hideActionsColumn ? "actions" : "", label: "" },
    ];
  }, [props]);

  const tableRows: RowProps[] = useMemo(() => {
    const data = props.data || [];

    return data.map((row) => {
      const rowData = row as Record<string, unknown>;

      Object.entries(rowData).forEach(([key, data]) => {
        const schemaItem = tableHeaders.find((item) => item.id === key);

        if (!schemaItem) {
          return;
        }

        if (schemaItem.format) {
          rowData[key] = schemaItem.format(String(data));
        }
      });

      return {
        ...rowData,
        id: String(rowData.id),
        actions: {
          component: (
            <Box>
              <IconButton
                onClick={() => {
                  if (props.onAction) {
                    props.onAction({ action: "edit", row: rowData });
                  }
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(rowData.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  if (props.onAction) {
                    props.onAction({ action: "details", row: rowData });
                  }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [props, tableHeaders, deleteItem]);

  return (
    <Box>
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
                placeholder: "Search",
                onChange: handleSearchChange,
              },
            ]}
          />
        </Box>
        <Button variant="contained" onClick={props.onAddNew}>
          Add new
        </Button>
      </Box>

      <Table
        isPending={props.isPending || false}
        isEmptyStateVisible={Boolean(searchTerm && !props.data?.length)}
        headers={tableHeaders}
        rows={tableRows}
        data={props.data}
        tableQueryState={props.tableQueryState}
        updateTableQueryState={props.setTableQueryState}
        total={props.total}
        pageCount={props.pageCount}
      />
    </Box>
  );
};

export default TableSubmodule;
