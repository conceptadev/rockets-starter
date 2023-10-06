"use client";

import { FC, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Table, Switch, Text } from "@concepta/react-material-ui";
import {
  RowsProps,
  SimpleActionButton,
  SimpleOptionButton,
} from "@concepta/react-material-ui/dist/components/Table/Table";
import { rows, headers } from "./fakeData";
import { CustomNameCell, CustomStatusCell } from "./CustomCells";
import CustomToolbarActionButtons from "./CustomToolbarActionButtons";
import CustomRowOptions from "./CustomRowOptions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TableScreen: FC = () => {
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "checkboxes") {
      return setShowCheckboxes(!showCheckboxes);
    }
    return setShowOptions(!showOptions);
  };

  const customRows: () => RowsProps[] = () => {
    return rows.map((row) => {
      const { id, name, email, status, role, lastLogin } = row;

      return {
        id,
        name: {
          sortableValue: name,
          component: <CustomNameCell name={name} email={email} />,
        },
        status: {
          sortableValue: status,
          component: <CustomStatusCell status={status} />,
        },
        role,
        lastLogin,
      };
    });
  };

  const actionButtons: SimpleActionButton[] = [
    {
      key: "edit",
      // eslint-disable-next-line no-console
      onClick: ({ selectedRows }) => console.log("Edit rows:", selectedRows),
      renderItem: <EditIcon />,
    },

    {
      key: "delete",
      // eslint-disable-next-line no-console
      onClick: ({ selectedRows }) => console.log("Delete rows:", selectedRows),
      renderItem: <DeleteIcon />,
    },
  ];

  const optionButtons: SimpleOptionButton[] = [
    {
      key: "edit",
      // eslint-disable-next-line no-console
      onClick: (row) => console.log("row:", row),
      icon: <EditIcon />,
      text: "Edit",
    },
    {
      key: "delete",
      // eslint-disable-next-line no-console
      onClick: (row) => console.log("row:", row),
      icon: <DeleteIcon />,
    },
    {
      key: "click",
      // eslint-disable-next-line no-console
      onClick: (row) => console.log("row:", row),
      text: "click",
    },
  ];

  return (
    <>
      <Box display="flex">
        <Box>
          <Switch
            sx={{ margin: "0 auto" }}
            name="checkboxes"
            checked={showCheckboxes}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          Checkboxes
        </Box>
        <Box>
          <Switch
            sx={{ margin: "0 auto" }}
            name="options"
            checked={showOptions}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
          Options
        </Box>
      </Box>

      <Box display="flex">
        <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={1}>
          Table with Custom Toolbar items array and Custom options items array
        </Text>
      </Box>

      <Table
        rows={customRows()}
        headers={headers}
        hasCheckboxes={showCheckboxes}
        hasOptions={showOptions}
        customToolbarActionButtons={actionButtons} // Custom Toolbar items
        customRowOptions={optionButtons} // Custom options items
      />

      <Divider />

      <Box display="flex" mt={2}>
        <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={1}>
          Table with Custom Toolbar component and Custom options component
        </Text>
      </Box>

      <Table
        rows={customRows()}
        headers={headers}
        hasCheckboxes={showCheckboxes}
        hasOptions={showOptions}
        customToolbarActionButtons={(
          { selectedRows } // Custom toolbar component
        ) => <CustomToolbarActionButtons selectedRows={selectedRows} />}
        customRowOptions={(
          { row, close } // Custom options component
        ) => <CustomRowOptions row={row} close={close} />}
      />
    </>
  );
};

export default TableScreen;
