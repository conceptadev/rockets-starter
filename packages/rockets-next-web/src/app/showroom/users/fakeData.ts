import { HeaderProps } from "@concepta/react-material-ui/dist/components/Table/types";

function createData(
  id: string,
  name: string,
  email: string,
  status: string,
  role: string,
  lastLogin: string
): Record<string, string> {
  return {
    id,
    name,
    email,
    status,
    role,
    lastLogin,
  };
}

export const headers: HeaderProps[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
  {
    id: "lastLogin",
    numeric: false,
    disablePadding: false,
    label: "Last Login",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

export const rows = [
  createData(
    "carmelGreen",
    "Carmel Green",
    "emailaddress@myschoolworx.com",
    "schedule",
    "teacher",
    "10.01.21"
  ),
  createData(
    "taylorSmith",
    "Taylor Smith",
    "emailaddress@myschoolworx.com",
    "unavailable",
    "teacher",
    "10.01.21"
  ),
  createData(
    "narkissosHeracles",
    "Narkissos Heracles",
    "emailaddress@myschoolworx.com",
    "available",
    "teacher",
    "10.01.21"
  ),
  createData(
    "ythereaErato",
    "Cytherea Erato",
    "emailaddress@myschoolworx.com",
    "unavailable",
    "teacher",
    "10.01.21"
  ),
  createData(
    "ismeneMelaina",
    "Ismene Melaina",
    "emailaddress@myschoolworx.com",
    "available",
    "director",
    "10.01.21"
  ),
  createData(
    "zeusAristaios",
    "Zeus Aristaios",
    "emailaddress@myschoolworx.com",
    "available",
    "teacher",
    "10.01.21"
  ),
  createData(
    "deimosRheie",
    "Deimos Rheie",
    "emailaddress@myschoolworx.com",
    "schedule",
    "teacher",
    "10.01.21"
  ),
  createData(
    "mnemosyneAndromeda",
    "Mnemosyne Andromeda",
    "emailaddress@myschoolworx.com",
    "schedule",
    "counselor",
    "10.01.21"
  ),
  createData(
    "pythiosPhoibos",
    "Pythios Phoibos",
    "emailaddress@myschoolworx.com",
    "schedule",
    "teacher",
    "10.01.21"
  ),
  createData(
    "pontusCrius",
    "Pontus Crius",
    "emailaddress@myschoolworx.com",
    "unavailable",
    "teacher",
    "10.01.21"
  ),
  createData(
    "poseidonApollo",
    "Poseidon Apollo",
    "emailaddress@myschoolworx.com",
    "available",
    "counselor",
    "10.01.21"
  ),
  createData(
    "deianeiraZeus",
    "Deianeira Zeus",
    "emailaddress@myschoolworx.com",
    "unavailable",
    "teacher",
    "10.01.21"
  ),
];
