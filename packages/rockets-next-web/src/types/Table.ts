import {
  HeaderProps,
  RowProps,
  TableQueryStateProps,
} from "@concepta/react-material-ui/dist/components/Table/types";

export type TableRootProps =
  | {
      rows: RowProps[];
      headers: HeaderProps[];
      total?: number;
      pageCount?: never;
      tableQueryState?: never;
      updateTableQueryState?: never;
    }
  | {
      rows: RowProps[];
      headers: HeaderProps[];
      total: number;
      pageCount: number;
      tableQueryState: TableQueryStateProps;
      updateTableQueryState: React.Dispatch<
        React.SetStateAction<TableQueryStateProps>
      >;
    };
