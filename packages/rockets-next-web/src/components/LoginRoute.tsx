import { Navigate } from "react-router";
import { useAuth } from "@concepta/react-auth-provider";
import { AuthModule } from "@concepta/react-material-ui/";

type LoginRouteProps = {
  home: string;
};

const LoginRoute = ({ home }: LoginRouteProps) => {
  const { accessToken: authAccessToken } = useAuth();

  const accessToken = authAccessToken ?? localStorage.getItem("accessToken");

  if (accessToken) {
    return <Navigate to={home} replace />;
  }

  return <AuthModule route="signIn" />;
};

export default LoginRoute;
