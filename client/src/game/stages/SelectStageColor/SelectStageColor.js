/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectStageColor.scss';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { LAYER_VISIBILITY_IID } from '../../../constants/interfaceIds';
import { STAGE_LAYER_ID } from '../../constants';
import { toggleLayerVisibility } from '../../../store/actions/game/gameViewEditorActions';
import Button from '../../../ui/Button/Button';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import FormLabel from '../../../ui/FormLabel/FormLabel';

const SelectStageColor = ({ 
  gameViewEditor: { layerInvisibility }, 
  toggleLayerVisibility,
  onSelectColor,
  selectedColor
}) => {
  return <>
      <FormLabel>Background Color</FormLabel>
      <AggregateColorSelect selectedColor={selectedColor} onSelectColor={onSelectColor}/>
      {<Unlockable interfaceId={LAYER_VISIBILITY_IID}>
      <Button onClick={() => {
        toggleLayerVisibility(STAGE_LAYER_ID)
      }}>{!layerInvisibility[STAGE_LAYER_ID] ? 'Hide Default Background Layer' : 'Show Default Background Layer'}</Button>
    </Unlockable>}
  </>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor
})

export default compose(
  connect(mapStateToProps, { toggleLayerVisibility }),
)(SelectStageColor);
