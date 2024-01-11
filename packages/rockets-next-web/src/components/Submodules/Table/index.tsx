import type {
  HeaderProps,
  RowProps,
  TableQueryStateProps,
} from "@concepta/react-material-ui/dist/components/Table/types";

import { useState, useMemo, useEffect } from "react";
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

type Action = "creation" | "edit" | "details" | null;

type BasicType = string | number | boolean;

type SimpleFilter = Record<string, BasicType | BasicType[] | null>;

type ActionCallbackPayload = {
  action: Action;
  row: Record<string, unknown>;
};

interface TableSubmoduleProps {
  queryResource: string;
  tableSchema: HeaderProps[];
  onAction: ({ action, row }: ActionCallbackPayload) => void;
  onAddNew: () => void;
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
        props.refresh();
      },
      onError: () => toast.error("Failed to delete data."),
    }
  );

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);

    if (!term) {
      props.updateSimpleFilter({
        email: null,
      });

      return;
    }

    const filter = {
      email: `||$contL||${term}||$or||username||$contL||${term}`,
    };

    props.updateSimpleFilter(filter);
  };

  const tableRows: RowProps[] = useMemo(() => {
    const data = props.data || [];

    return data.map((row) => {
      const rowData = row as Record<string, unknown>;

      return {
        ...rowData,
        id: String(rowData.id),
        actions: {
          component: (
            <Box>
              <IconButton
                onClick={() => props.onAction({ action: "edit", row: rowData })}
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(rowData.id)}>
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  props.onAction({ action: "details", row: rowData })
                }
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          ),
        },
      };
    });
  }, [props, deleteItem]);

  useEffect(() => {
    props.refresh();
  }, [props.simpleFilter]);

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
        isPending={props.isPending}
        isEmptyStateVisible={Boolean(searchTerm && !props.data?.length)}
        headers={props.tableSchema}
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
