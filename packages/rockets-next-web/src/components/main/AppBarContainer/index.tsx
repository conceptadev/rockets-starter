"use client";

import { type ReactNode, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppBar } from "@concepta/react-material-ui";
import { useAuth } from "@concepta/react-auth-provider";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import type { User } from "@/types/User";

type HandleCloseMenu = () => void;

export default function AppBarContainer({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, doLogout } = useAuth();

  const drawerMenuItems = [
    {
      id: "/users",
      icon: <GroupsOutlinedIcon />,
      text: "Users",
      onClick: () => router.push("/users"),
    },
    {
      id: "/profile",
      icon: <PersonOutlinedIcon />,
      text: "Profile",
      onClick: () => router.push("/profile"),
    },
  ];

  const onLogoutClick = (handleCloseMenu: HandleCloseMenu) => {
    handleCloseMenu();
    doLogout();
    startTransition(() => router.replace("/login"));
  };

  return (
    <AppBar.Root key={pathname}>
      <AppBar.Drawer
        currentId={pathname}
        logo="/logo.svg"
        collapsable
        items={drawerMenuItems}
        expandedWidth={120}
      />
      <AppBar.Main>
        <AppBar.Nav
          text={(user as User)?.username || ""}
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
