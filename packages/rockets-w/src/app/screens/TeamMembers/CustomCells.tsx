import { FC } from 'react'
import { Box, Dropdown, Text } from '@concepta/react-material-ui'
import { DropdownItem } from '@concepta/react-material-ui/dist/components/Dropdown'

type CustomNameCellProps = {
  name: string
  email: string
}

const CustomNameCell: FC<CustomNameCellProps> = ({ name, email }) => (
  <>
    <Text fontSize={14} fontWeight={500} color="text.primary">
      {name}
    </Text>
    <Text fontSize={14} fontWeight={500} color="text.secondary">
      {email}
    </Text>
  </>
)

type CustomRoleCellProps = {
  id: string
  role: string
}

const CustomRoleCell: FC<CustomRoleCellProps> = ({ id, role }) => {
  const options: DropdownItem[] = [
    {
      key: 'resend',
      onClick: () => console.log('resend', id),
      text: 'Resend Invite',
    },
    {
      key: 'revoke',
      onClick: () => console.log('revoke', id),
      text: 'Revoke',
    },
  ]

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end">
      {role} <Dropdown options={options} toggleDirection="vertical" />
    </Box>
  )
}

export { CustomNameCell, CustomRoleCell }
