"use client";

import { Box } from "@mui/material";
import { Text } from "@concepta/react-material-ui";

import CrudModule from "@/components/CrudModule";

const UsersModule = () => {
  return (
    <Box>
      <Text fontFamily="Inter" fontSize={20} fontWeight={800} mt={4} mb={4}>
        Users
      </Text>

      <CrudModule resource="user" />
    </Box>
  );
};

export default UsersModule;
