"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppBar } from "@concepta/react-material-ui";
import Container from "@mui/material/Container";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

export default function Main({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const drawerMenuItems = [
    {
      id: "/users",
      icon: <GroupsOutlinedIcon />,
      text: "Users",
      onClick: () => router.push("/users"),
    },
  ];

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
          text="John Smith"
          subText="Amazing Inc."
          avatar="https://source.unsplash.com/random"
        />
        <Container>{children}</Container>
      </AppBar.Main>
    </AppBar.Root>
  );
}
