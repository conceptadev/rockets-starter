import React from 'react';
import { Text } from '@concepta/react-material-ui';
import { Box, Divider } from '@mui/material';

interface PluginsProps {
  text: string;
  children: React.ReactNode;
}

const Plugins: React.FC<PluginsProps> = ({ text, children }) => {
  return (
    <>
      <Box mt={3}>
        <Divider sx={{ width: '100%', margin: 0 }} variant="middle">
          <Text fontSize={14}>{text}</Text>
        </Divider>
      </Box>
      {children}
    </>
  );
};

export default Plugins;
