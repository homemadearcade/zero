/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import { selectBrush, clearBrush } from '../../../store/actions/game/gameSelectorActions';
import { openContextMenuFromClassId } from '../../../store/actions/game/contextMenuActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Texture from '../../textures/Texture/Texture';
import Icon from '../../../ui/Icon/Icon';
import { changeBrushIdHovering } from '../../../store/actions/game/hoverPreviewActions';
import { useWishTheme } from '../../../hooks/useWishTheme';

const BrushItem = ({
  gameModel: { gameModel: { brushes } },
  brushId,
  gameSelector: { brushIdSelectedBrushList },
  selectBrush,
  clearBrush,
  width, height,
  changeBrushIdHovering,
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const brush = brushes[brushId]
  
  const isSelected = brushIdSelectedBrushList === brushId

  const border = '1px solid ' + useWishTheme().primaryColor.hexString
  return <div
      style={{width: width? width: null, height: height? height: null, border: isSelected ? border : null }}
      onClick={() => {
        if(brushId === brushIdSelectedBrushList) {
          clearBrush()
        } else {
          selectBrush(brushId, brush.layerId)
        }
      }}
      onMouseEnter={() => {
        setIsHovering(true)
        changeBrushIdHovering(brushId)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
        changeBrushIdHovering(null)
      }}
      className="BrushItem"
    >
      {isSelected && isHovering && <Icon className="BrushItem__unselect" icon="faClose"/>}
      <div className="BrushItem__texture">
        <Texture textureTint={brush.textureTint} textureId={brush.textureId}/>
      </div>
    </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearBrush, changeBrushIdHovering }),
)(BrushItem);
