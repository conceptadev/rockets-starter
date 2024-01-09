import { Box, Button } from "@mui/material";
import { Filter } from "@concepta/react-material-ui";
import { FilterType } from "@concepta/react-material-ui/dist/components/Filter/Filter";

interface TableFilterProps {
  value: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
}

const TableFilter = (props: TableFilterProps) => {
  return (
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
              defaultValue: props.value,
              placeholder: "Search",
              onChange: props.onSearchChange,
            },
          ]}
        />
      </Box>
      <Button variant="contained" onClick={props.onAddNew}>
        Add new
      </Button>
    </Box>
  );
};

export default TableFilter;
