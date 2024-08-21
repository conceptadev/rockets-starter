import { type ReactNode, startTransition } from "react";
import { useAuth } from "@concepta/react-auth-provider";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, DrawerItemProps } from "@concepta/react-material-ui";

type HandleCloseMenu = () => void;

export default function AppBarContainer({
  children,
  menuItems,
}: {
  children: ReactNode;
  menuItems: DrawerItemProps[];
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, doLogout } = useAuth();

  const onLogoutClick = (handleCloseMenu: HandleCloseMenu) => {
    handleCloseMenu();
    doLogout();
    startTransition(() => navigate("/sign-in"));
  };

  return (
    <AppBar.Root key={location.pathname}>
      <AppBar.Drawer
        currentId={location.pathname}
        logo="/logo.svg"
        collapsible
        items={menuItems}
        expandedWidth={120}
      />
      <AppBar.Main>
        <AppBar.Nav
          text={(user as any)?.username || ""}
          avatar="https://source.unsplash.com/random"
          headerMenuOptions={(handleClose) => (
            <MenuItem onClick={() => onLogoutClick(handleClose)}>
              Sign Out
            </MenuItem>
          )}
        />
        <Container>{children}</Container>
      </AppBar.Main>
    </AppBar.Root>
  );
}
