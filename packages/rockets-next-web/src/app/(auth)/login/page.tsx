"use client";

import { AuthModule } from "@concepta/react-material-ui";
import { Button, Box } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

const Login = () => {
  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:3001/auth/github/login";
  };
  const handleAppleLogin = () => {
    window.location.href = "http://localhost:3001/auth/apple/login";
  };
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google/login";
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
      <Button
        variant="contained"
        startIcon={<GitHubIcon />}
        onClick={handleAppleLogin}
        sx={{ mt: 2 }}
      >
        Login with Apple
      </Button>
      <Button
        variant="contained"
        startIcon={<GitHubIcon />}
        onClick={handleGoogleLogin}
        sx={{ mt: 2 }}
      >
        Login with Google
      </Button>
    </Box>
  );
};

export default Login;
