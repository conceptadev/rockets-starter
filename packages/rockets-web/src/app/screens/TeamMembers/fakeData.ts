import { HeadersProps } from '@concepta/react-material-ui/dist/components/Table/Table';

function createData(
  id: string,
  name: string,
  email: string,
  role: string,
): Record<string, string> {
  return {
    id,
    name,
    email,
    role,
  };
}

export const headers: HeadersProps[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'role',
    numeric: false,
    disablePadding: false,
    label: 'Role',
    textAlign: 'right',
  },
];

export const rows = [
  createData('johnSmith', 'John Smith', 'johnsmith@example.com', 'Owner'),
  createData('codyFisher', 'Cody Fisher', 'cody.fisher@example.com', 'Admin'),
  createData(
    'estherHoward',
    'Esther Howard',
    'esther.howard@example.com',
    'Member',
  ),
  createData(
    'ythereaErato',
    'Cytherea Erato',
    'emailaddress@example.com',
    'Invited',
  ),
  createData(
    'jenny.wilson@example.com',
    '',
    'jenny.wilson@example.com',
    'Invited',
  ),
  createData(
    'zeusAristaios',
    'Zeus Aristaios',
    'emailaddress@example.com',
    'Member',
  ),
  createData(
    'deimosRheie',
    'Deimos Rheie',
    'emailaddress@example.com',
    'Reader',
  ),
  createData(
    'mnemosyneAndromeda',
    'Mnemosyne Andromeda',
    'emailaddress@example.com',
    'Reader',
  ),
  createData(
    'pythiosPhoibos',
    'Pythios Phoibos',
    'emailaddress@example.com',
    'Reader',
  ),
  createData(
    'pontusCrius',
    'Pontus Crius',
    'emailaddress@example.com',
    'Invited',
  ),
  createData(
    'poseidonApollo',
    'Poseidon Apollo',
    'emailaddress@example.com',
    'Member',
  ),
  createData(
    'deianeiraZeus',
    'Deianeira Zeus',
    'emailaddress@example.com',
    'Invited',
  ),
];
