import { FC, useState } from "react";
import { Dialog, Table, Text } from "@concepta/react-material-ui";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useTheme from "@mui/material/styles/useTheme";
import { RowsProps } from "@concepta/react-material-ui/dist/components/Table/Table";
import ScreenWithContainer from "app/components/ScreenWithContainer";
import { rows, headers } from "./fakeData";
import { CustomNameCell, CustomRoleCell } from "./CustomCells";
import { MemberForm } from "./Styles";

const TeamMembers: FC = () => {
  const theme = useTheme();

  const [addMemberModalOpen, setAddMemberModalOpen] = useState<boolean>(false);

  const openMemberModal = () => {
    setAddMemberModalOpen(true);
  };
  const closeMemberModal = () => {
    setAddMemberModalOpen(false);
  };

  const customRows: () => RowsProps[] = () => {
    return rows.map((row) => {
      const { id, name, email, role } = row;

      return {
        id,
        name: {
          sortableValue: name,
          component: <CustomNameCell name={name} email={email} />,
        },
        role: {
          sortableValue: role,
          component: <CustomRoleCell id={id} role={role} />,
        },
      };
    });
  };

  const lightMode = theme.palette.mode === "light";

  return (
    <ScreenWithContainer currentId="teamMembers">
      <Box display="flex" sx={{ mb: 4 }}>
        <Box flex={1}>
          <Text
            fontWeight="500"
            fontSize={24}
            sx={{ color: lightMode ? "#111827" : "#dce2ee" }}
          >
            Team Members
          </Text>
          <Text
            fontWeight="400"
            fontSize={14}
            sx={{ color: lightMode ? "#6B7280" : "#9098a7" }}
          >
            Invite other members to your account
          </Text>
        </Box>
        <Box display="flex" alignItems="flex-end">
          <Button variant="contained" onClick={openMemberModal}>
            Invite New Member
          </Button>
        </Box>
      </Box>

      <Table rows={customRows()} headers={headers} variant="outlined" />

      <Dialog
        open={addMemberModalOpen}
        handleClose={closeMemberModal}
        title="Invite New Member"
        dividers
      >
        <MemberForm closeMemberModal={closeMemberModal} />
      </Dialog>
    </ScreenWithContainer>
  );
};

export default TeamMembers;
