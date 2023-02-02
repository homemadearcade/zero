/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { selectBrush, clearBrush } from '../../../store/actions/gameEditorActions';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Sprite from '../../sprites/Sprite/Sprite';
import Icon from '../../../ui/Icon/Icon';

const BrushItem = ({
  gameModel: { gameModel: { brushes } },
  brushId,
  gameEditor: { brushIdSelectedBrushList },
  selectBrush,
  clearBrush,
  width, height
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const brush = brushes[brushId]
  
  const isSelected = brushIdSelectedBrushList === brushId

  return <div
      style={{width: width? width: null, height: height? height: null}}
      onClick={() => {
        if(brushId === brushIdSelectedBrushList) {
          clearBrush()
        } else {
          selectBrush(brushId)
        }
      }}
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
      className={classNames("BrushItem", { 'BrushItem--selected': isSelected })}
    >
      {isSelected && isHovering && <Icon className="BrushItem__unselect" icon="faClose"/>}
      <div className="BrushItem__sprite">
        <Sprite tint={brush.tint} textureId={brush.textureId}/>
      </div>
    </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameEditor: state.gameEditor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearBrush }),
)(BrushItem);
