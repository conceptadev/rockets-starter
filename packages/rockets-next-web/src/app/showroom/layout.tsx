"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ContainerWithDrawer } from "@concepta/react-material-ui";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

export default function Showroom({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const drawerMenuItems = [
    {
      id: "/showroom/users",
      icon: <GroupsOutlinedIcon />,
      text: "Users",
      onClick: () => router.push("/showroom/users"),
    },
  ];

  return (
    <ContainerWithDrawer
      key={pathname}
      drawerItems={drawerMenuItems}
      currentId={pathname}
      logo="/logo.svg"
      showNotifications
      notificationsNumber={6}
      notificationsOnClick={() =>
        // eslint-disable-next-line no-console
        console.log("click")
      }
      headerAvatar="https://source.unsplash.com/random"
      headerText="John Smith"
      headerSubText="Amazing Inc."
    >
      {children}
    </ContainerWithDrawer>
  );
}
