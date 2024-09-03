"use client";

import { AuthModule } from "@concepta/react-material-ui";
import { Button, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Login = () => {
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3001/auth/apple/login";
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <AuthModule route="signIn" />
      <Button
        variant="contained"
        startIcon={<GitHubIcon />}
        onClick={handleGitHubLogin}
        sx={{ mt: 2 }}
      >
        Login with GitHub
      </Button>
    </Box>
  );
};

export default Login;
