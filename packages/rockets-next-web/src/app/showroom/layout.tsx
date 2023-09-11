"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ContainerWithDrawer } from "@concepta/react-material-ui";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ExtensionOutlinedIcon from "@mui/icons-material/ExtensionOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import GridOnIcon from "@mui/icons-material/GridOn";
import CodeIcon from "@mui/icons-material/Code";

export default function Showroom({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const drawerMenuItems = [
    {
      id: "/showroom/profile",
      icon: <PersonOutlineOutlinedIcon />,
      text: "Profile",
      onClick: () => router.push("/showroom/profile"),
    },
    {
      id: "/showroom/account",
      icon: <BusinessOutlinedIcon />,
      text: "Account",
      onClick: () => alert("foo"),
      active: true,
    },
    {
      id: "/showroom/billing",
      icon: <PaymentsOutlinedIcon />,
      text: "Billing",
      onClick: () => alert("foo"),
    },
    {
      id: "/showroom/integrations",
      icon: <ExtensionOutlinedIcon />,
      text: "Integrations",
      onClick: () => alert("foo"),
    },
    {
      id: "/showroom/home",
      icon: <HomeOutlinedIcon />,
      text: "Home",
      onClick: () => router.push("/showroom/home"),
    },
    {
      id: "/showroom/table",
      icon: <GridOnIcon />,
      text: "Table",
      onClick: () => router.push("/showroom/table"),
    },
    {
      id: "/showroom/teamMembers",
      icon: <GroupsOutlinedIcon />,
      text: "TeamMembers",
      onClick: () => router.push("/showroom/team-members"),
    },
    {
      id: "/showroom/jsonform",
      icon: <CodeIcon />,
      text: "Jsonform",
      onClick: () => router.push("/showroom/jsonform"),
    },
    {
      id: "/showroom/simpleform",
      icon: <CodeIcon />,
      text: "Simple Forms",
      onClick: () => router.push("/showroom/simple-forms"),
    },
    {
      id: "/showroom/theme",
      icon: <ColorLensOutlinedIcon />,
      text: "Theme",
      onClick: () => router.push("/showroom/theme"),
    },
    {
      id: "login",
      icon: <PersonOutlineOutlinedIcon />,
      text: "Login",
      onClick: () => router.push("/showroom/login"),
    },
    {
      id: "signUp",
      icon: <PersonOutlineOutlinedIcon />,
      text: "SignUp",
      onClick: () => router.push("/showroom/sign-up"),
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
      notificationsOnClick={() => console.log("click")}
      avatar="https://source.unsplash.com/random"
      text="John Smith"
      subText="Amazing Inc."
    >
      {children}
    </ContainerWithDrawer>
  );
}
