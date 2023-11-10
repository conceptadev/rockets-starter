import type { FC } from "react";

import { Text } from "@concepta/react-material-ui";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type CustomNameCellProps = {
  name: string;
  email: string;
};

const CustomNameCell: FC<CustomNameCellProps> = ({ name, email }) => (
  <>
    <Text fontSize={14} fontWeight={500} color="text.primary">
      {name}
    </Text>
    <Text fontSize={14} fontWeight={500} color="text.secondary">
      {email}
    </Text>
  </>
);

type CustomStatusCellProps = {
  status: string;
};

const CustomStatusCell: FC<CustomStatusCellProps> = ({ status }) => {
  const statusIcon: Record<string, React.ReactNode> = {
    schedule: <WatchLaterIcon color="primary" />,
    unavailable: <RemoveCircleIcon color="error" />,
    available: <CheckCircleIcon color="success" />,
  };

  return <>{statusIcon[status] && statusIcon[status]}</>;
};

type CustomRoleCellProps = {
  role: string;
};

const roleMapper: Record<string, string> = {
  teacher: "Teacher",
  director: "Director",
  counselor: "Counselor",
};

const CustomRoleCell: FC<CustomRoleCellProps> = ({ role }) => {
  return <>{roleMapper[role]}</>;
};

export { CustomNameCell, CustomStatusCell, CustomRoleCell };
