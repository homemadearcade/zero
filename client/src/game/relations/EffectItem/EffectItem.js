/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

// import './EffectITem.scss';
import { selectBrush, clearBrush } from '../../../store/actions/gameSelectorActions';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Sprite from '../../sprites/Sprite/Sprite';
import { changeEffectIdHovering } from '../../../store/actions/hoverPreviewActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { EFFECT_SELECT_IID } from '../../../constants/interfaceIds';
import { NestedListItem } from '../../../ui/NestedList/NestedList';
import { openCreateEffect } from '../../../store/actions/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import { effectDisplayNames } from '../../constants';

const EffectItem = ({
  gameModel: { gameModel: { effects } },
  effectId,
  changeEffectIdHovering,
  openCreateEffect
}) => {
  const effect = effects[effectId]

  return <Unlockable interfaceId={EFFECT_SELECT_IID}>
    <div
    onMouseEnter={() => {
      changeEffectIdHovering(effectId)
    }}
    onMouseLeave={() => {
      changeEffectIdHovering(null)
    }}>
      <NestedListItem
        onClick={() => {openCreateEffect(effect)}}
      >
        <Typography variant="body2">
          {effectDisplayNames[effect.type]}
        </Typography>
      </NestedListItem>
    </div>
  </Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, openCreateEffect, selectBrush, clearBrush, changeEffectIdHovering }),
)(EffectItem);
