"use client";

import { type ReactNode, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { AppBar } from "@concepta/react-material-ui";
import { useAuth } from "@concepta/react-auth-provider";
import useDataProvider, { useQuery } from "@concepta/react-data-provider";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import Loading from "@/components/Loading/Loading";

type HandleCloseMenu = () => void;

interface UserData {
  id: string;
  username: string;
  email: string;
}

export default function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { accessToken: authToken, user, doLogout, setUser } = useAuth();
  const { get } = useDataProvider();

  const accessToken = authToken ?? localStorage.getItem("accessToken");

  const drawerMenuItems = [
    {
      id: "/users",
      icon: <GroupsOutlinedIcon />,
      text: "Users",
      onClick: () => router.push("/users"),
    },
  ];

  const { data, isPending } = useQuery(
    () =>
      get({
        uri: `/user/${jwtDecode(accessToken).sub}`,
      }),
    true,
    {
      onSuccess: (data) => {
        setUser(data);
      },
    }
  );

  const onLogoutClick = (handleCloseMenu: HandleCloseMenu) => {
    handleCloseMenu();
    doLogout();
    startTransition(() => router.replace("/login"));
  };

  if (!data && isPending) {
    return <Loading />;
  }

  if (!data) {
    return null;
  }

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
          text={(user as UserData)?.username || ""}
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
