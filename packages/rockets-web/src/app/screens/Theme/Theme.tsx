import { FC, useContext } from 'react'
import { Switch } from '@concepta/react-material-ui'
import {
  ThemeContext,
  ThemeContextType,
} from 'app/context/ThemeContextProvider'
import ScreenWithContainer from 'app/components/ScreenWithContainer'

const Theme: FC = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext) as ThemeContextType

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked)
  }

  return (
    <ScreenWithContainer currentId="theme">
      <Switch
        sx={{ margin: '0 auto' }}
        checked={darkMode}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      Dark Mode
    </ScreenWithContainer>
  )
}

export default Theme
