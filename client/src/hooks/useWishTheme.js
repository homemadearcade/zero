import { useSelector } from 'react-redux'
import { enrichHexStringColor } from '../utils/colorUtils'

export const useWishTheme = () => {
  const theme = useSelector((state) => state.theme)

  return {
    primaryColor: enrichHexStringColor(theme.primaryColor)
  }
}

