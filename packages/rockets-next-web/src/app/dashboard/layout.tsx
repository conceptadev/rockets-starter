"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import ContainerWithDrawer from "@concepta/react-material-ui";
import MenuItem from "@mui/material/MenuItem";

export default function Showroom({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const menuOptions = (
    handleClose: any // TODO: Change this type once https://github.com/conceptadev/rockets-react/pull/10 gets merged
  ) => (
    <>
      <MenuItem
        key="Profile"
        onClick={() => {
          handleClose();
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        key="My account"
        onClick={() => {
          handleClose();
        }}
      >
        My account
      </MenuItem>
      <MenuItem
        key="Logout"
        onClick={() => {
          handleClose();
        }}
      >
        Logout
      </MenuItem>
    </>
  );

  return (
    <ContainerWithDrawer
      key={pathname}
      currentId={pathname}
      showNotifications
      notificationsNumber={6}
      notificationsOnClick={() => console.log("click")}
      headerAvatar="https://source.unsplash.com/random"
      headerText="John Smith"
      headerSubText="Amazing Inc."
      headerMenuOptions={menuOptions}
    >
      {children}
    </ContainerWithDrawer>
  );
}
