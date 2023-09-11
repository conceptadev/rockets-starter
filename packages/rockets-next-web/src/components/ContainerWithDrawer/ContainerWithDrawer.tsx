import React, { FC, ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import { Drawer, Navbar } from "@concepta/react-material-ui";
import { DrawerItemProps } from "@concepta/react-material-ui/dist/components/Drawer/DrawerItem";
import { TypographyProps } from "@mui/material/Typography";
import { TextProps } from "@concepta/react-material-ui/dist/interfaces";

type Props = {
  drawerItems: DrawerItemProps[];
  currentId?: string;
  logo?: string;
  children: ReactNode;
  showNotifications?: boolean;
  notificationsNumber?: number;
  notificationsOnClick?: () => void;
  avatar?: string;
  text?: string;
  subText?: string;
  fontFamily?: TypographyProps["fontFamily"];
  fontSize?: TypographyProps["fontSize"];
  fontWeight?: TypographyProps["fontWeight"];
  color?: TypographyProps["color"];
  textProps?: TextProps;
};

const ContainerWithDrawer: FC<Props> = ({
  drawerItems,
  currentId,
  logo,
  children,
  showNotifications,
  notificationsNumber,
  notificationsOnClick,
  avatar,
  text,
  subText,
  textProps = {
    fontSize: 16,
    fontWeight: 400,
  },
}) => {
  const [mobileIsOpen, setMobileIsOpen] = useState(false);

  const toggleMobileDrawer = () => {
    setMobileIsOpen((prv) => !prv);
  };

  return (
    <Box sx={{ display: "flex" }} id="ContainerWithDrawer">
      {drawerItems && (
        <Drawer
          items={drawerItems}
          currentId={currentId}
          toggleMobileDrawer={toggleMobileDrawer}
          mobileIsOpen={mobileIsOpen}
          logo={logo}
          textProps={textProps}
        />
      )}

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Navbar
          drawerToggle={toggleMobileDrawer}
          showNotifications={showNotifications}
          notificationsNumber={notificationsNumber}
          notificationsOnClick={notificationsOnClick}
          avatar={avatar}
          text={text}
          subText={subText}
        />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {children}
        </Container>
        <Toolbar />
      </Box>
    </Box>
  );
};

export default ContainerWithDrawer;
