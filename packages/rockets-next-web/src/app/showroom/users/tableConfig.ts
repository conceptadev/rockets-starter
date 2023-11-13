import { HeaderProps } from "@concepta/react-material-ui/dist/components/Table/types";

function createData(
  id: string,
  email: string,
  username: string
): Record<string, string> {
  return {
    id,
    email,
    username,
  };
}

export const headers: HeaderProps[] = [
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Username",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "",
  },
];

export const rows = [
  createData("carmelGreen", "emailaddress@myschoolworx.com", "carmelGreen"),
  createData("taylorSmith", "emailaddress@myschoolworx.com", "taylorSmith"),
  createData(
    "narkissosHeracles",
    "emailaddress@myschoolworx.com",
    "narkissosHeracles"
  ),
  createData("ythereaErato", "emailaddress@myschoolworx.com", "ythereaErato"),
  createData("ismeneMelaina", "emailaddress@myschoolworx.com", "ismeneMelaina"),
  createData("zeusAristaios", "emailaddress@myschoolworx.com", "zeusAristaios"),
  createData("deimosRheie", "emailaddress@myschoolworx.com", "deimosRheie"),
  createData(
    "mnemosyneAndromeda",
    "emailaddress@myschoolworx.com",
    "mnemosyneAndromeda"
  ),
  createData(
    "pythiosPhoibos",
    "emailaddress@myschoolworx.com",
    "pythiosPhoibos"
  ),
  createData("pontusCrius", "emailaddress@myschoolworx.com", "pontusCrius"),
  createData(
    "poseidonApollo",
    "emailaddress@myschoolworx.com",
    "poseidonApollo"
  ),
  createData("deianeiraZeus", "emailaddress@myschoolworx.com", "deianeiraZeus"),
];
