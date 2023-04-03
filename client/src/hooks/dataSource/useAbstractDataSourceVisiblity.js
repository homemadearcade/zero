import { useSelector } from 'react-redux'
import { IS_DATA_REMOVED } from '../../game/constants'

export const useAbstractDataSourceVisibility = ({abstractClass, dataSourceId, isRemoved}) => {
  const selectorInterfaceListInvisibility = useSelector((state) => state.gameSelector.selectorInterfaceListInvisibility)
  const isDataSourceInvisible = selectorInterfaceListInvisibility[abstractClass][dataSourceId]
  const isRemovedInvisible = isRemoved && selectorInterfaceListInvisibility[abstractClass][IS_DATA_REMOVED]

  return !isDataSourceInvisible && !isRemovedInvisible
}

