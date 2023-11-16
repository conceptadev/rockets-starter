"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ContainerWithDrawer } from "@concepta/react-material-ui";
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
    <ContainerWithDrawer
      key={pathname}
      drawerItems={drawerMenuItems}
      currentId={pathname}
      logo="/logo.svg"
      headerAvatar="https://source.unsplash.com/random"
      headerText="John Smith"
      headerSubText="Amazing Inc."
    >
      {children}
    </ContainerWithDrawer>
  );
}
