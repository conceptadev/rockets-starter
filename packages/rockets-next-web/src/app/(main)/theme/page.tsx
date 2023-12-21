"use client";

import { useContext } from "react";
import { Switch } from "@concepta/react-material-ui";

import { ThemeContext, ThemeContextType } from "@/context/ThemeContextProvider";

const Theme = () => {
  const { darkMode, setDarkMode } =
    (useContext?.(ThemeContext) as ThemeContextType) || {};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode?.(event.target.checked);
  };

  return (
    <>
      <Switch
        sx={{ margin: "0 auto" }}
        checked={darkMode}
        onChange={handleChange}
        inputProps={{ "aria-label": "controlled" }}
      />
      Dark Mode
    </>
  );
};

export default Theme;
