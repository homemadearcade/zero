/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushItem.scss';
import classNames from 'classnames';
import { selectBrush, clearBrush } from '../../store/actions/editorActions';
import { openContextMenuFromClassId } from '../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Sprite from '../ui/Sprite/Sprite';
import Icon from '../../app/ui/Icon/Icon';
import { Paper } from '@mui/material';

const BrushItem = ({
  game: { gameModel: { brushes } },
  brushId,
  editor: { brushIdSelectedBrushList },
  selectBrush,
  clearBrush,
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const brush = brushes[brushId]
  
  const isSelected = brushIdSelectedBrushList === brushId

  return <div
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
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectBrush, clearBrush }),
)(BrushItem);
