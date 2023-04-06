import { useSelector } from 'react-redux'
import { IS_DATA_REMOVED } from '../../game/constants'

export const useAbstractDataSourceVisibility = ({abstractClass, dataSourceIID, isRemoved}) => {
  const selectorInterfaceListInvisibility = useSelector((state) => state.gameSelector.selectorInterfaceListInvisibility)
  const isDataSourceInvisible = selectorInterfaceListInvisibility[abstractClass][dataSourceIID]
  const isRemovedInvisible = isRemoved && selectorInterfaceListInvisibility[abstractClass][IS_DATA_REMOVED]

  return !isDataSourceInvisible && !isRemovedInvisible
}

