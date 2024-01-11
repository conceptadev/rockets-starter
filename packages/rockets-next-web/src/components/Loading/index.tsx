import { Box, CircularProgress } from "@mui/material";

const Loading = () => (
  <Box
    display="flex"
    flex={1}
    alignItems="center"
    justifyContent="center"
    height="100vh"
  >
    <CircularProgress />
  </Box>
);

export default Loading;
