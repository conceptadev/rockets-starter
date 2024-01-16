"use client";

import { type ReactNode } from "react";

import AppBarContainer from "@/components/AppBarContainer";

export default function Main({ children }: { children: ReactNode }) {
  return <AppBarContainer>{children}</AppBarContainer>;
}
