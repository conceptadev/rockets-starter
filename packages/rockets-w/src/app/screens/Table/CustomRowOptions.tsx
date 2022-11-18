import { FC } from 'react'
import { MenuItem } from '@concepta/react-material-ui/'
import { CustomRowOptionsProps } from '@concepta/react-material-ui/dist/components/Table/Table'
import Settings from '@mui/icons-material/Settings'

const CustomRowOptions: FC<CustomRowOptionsProps> = ({ row, close }) => {
  const handleMenuClick = (log: string) => () => {
    console.log(log, row)
    close()
  }

  return (
    <>
      <MenuItem onClick={handleMenuClick('Settings')}>
        <Settings />
      </MenuItem>
      <MenuItem onClick={handleMenuClick('Edit')}>Edit</MenuItem>
      <MenuItem onClick={handleMenuClick('Open')}>Open</MenuItem>
    </>
  )
}

export default CustomRowOptions
