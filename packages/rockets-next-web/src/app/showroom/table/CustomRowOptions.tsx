import { FC } from "react";
import MenuItem from "@mui/material/MenuItem";
import { CustomRowOptionsProps } from "@concepta/react-material-ui/dist/components/Table/Table";
import Settings from "@mui/icons-material/Settings";

const CustomRowOptions: FC<CustomRowOptionsProps> = ({ close }) => {
  const handleMenuClick = (log: string) => () => {
    close();
    return log;
  };

  return (
    <>
      <MenuItem onClick={handleMenuClick("Settings")}>
        <Settings />
      </MenuItem>
      <MenuItem onClick={handleMenuClick("Edit")}>Edit</MenuItem>
      <MenuItem onClick={handleMenuClick("Open")}>Open</MenuItem>
    </>
  );
};

export default CustomRowOptions;
