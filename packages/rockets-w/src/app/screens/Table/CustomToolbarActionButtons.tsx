import { FC } from 'react'
import { IconButton } from '@concepta/react-material-ui/'
import { SelectedRows } from '@concepta/react-material-ui/dist/components/Table/Table'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const CustomToolbarActionButtons: FC<SelectedRows> = props => {
  const { selectedRows } = props

  return (
    <>
      <IconButton onClick={() => console.log('Edit rows:', selectedRows)}>
        <EditIcon />
      </IconButton>

      <IconButton onClick={() => console.log('Delete rows:', selectedRows)}>
        <DeleteIcon />
      </IconButton>
    </>
  )
}

export default CustomToolbarActionButtons
