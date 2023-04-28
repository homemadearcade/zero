import { useSelector } from 'react-redux'
import { IS_DATA_REMOVED } from '../../game/constants'

export const useRelationDataSourceVisibility = ({relationDataIID, dataSourceIID, isRemoved}) => {
  const selectorInterfaceListInvisibility = useSelector((state) => state.gameSelector.selectorInterfaceListInvisibility)
  const isDataSourceInvisible = selectorInterfaceListInvisibility[relationDataIID][dataSourceIID]
  const isRemovedInvisible = isRemoved && selectorInterfaceListInvisibility[relationDataIID][IS_DATA_REMOVED]

  return !isDataSourceInvisible && !isRemovedInvisible
}

