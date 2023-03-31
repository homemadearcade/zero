import { useSelector } from 'react-redux'
import { IS_DATA_REMOVED } from '../../game/constants'

export const useEntityDataSourceVisibility = (entityModel) => {
  const selectorClassInvisibility = useSelector((state) => state.gameSelector.selectorClassInvisibility)
  const dataSource = entityModel.dataSource
  const selectorClass = entityModel.entityInterfaceId
  const isDataSourceInvisible = selectorClassInvisibility[selectorClass][dataSource]

  const isRemoved = entityModel.isRemoved
  const isRemovedInvisible = isRemoved && selectorClassInvisibility[selectorClass][IS_DATA_REMOVED]

  return !isDataSourceInvisible && !isRemovedInvisible
}

