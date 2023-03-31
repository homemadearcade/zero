import { useSelector } from 'react-redux'
import { IS_DATA_REMOVED } from '../../game/constants'

export const useAbstractDataSourceVisibility = ({abstractClass, dataSource, isRemoved}) => {
  const selectorClassInvisibility = useSelector((state) => state.gameSelector.selectorClassInvisibility)
  const isDataSourceInvisible = selectorClassInvisibility[abstractClass][dataSource]
  const isRemovedInvisible = isRemoved && selectorClassInvisibility[abstractClass][IS_DATA_REMOVED]

  return !isDataSourceInvisible && !isRemovedInvisible
}

