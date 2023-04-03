import { useSelector } from 'react-redux'
import { IS_DATA_REMOVED } from '../../game/constants'

export const useEntityDataSourceVisibility = (entityModel) => {
  const selectorInterfaceListInvisibility = useSelector((state) => state.gameSelector.selectorInterfaceListInvisibility)
  const dataSource = entityModel.dataSource
  const interfaceId = entityModel.entityInterfaceId
  const isDataSourceInvisible = selectorInterfaceListInvisibility[interfaceId][dataSource]

  const isRemoved = entityModel.isRemoved
  const isRemovedInvisible = isRemoved && selectorInterfaceListInvisibility[interfaceId][IS_DATA_REMOVED]

  return !isDataSourceInvisible && !isRemovedInvisible
}

