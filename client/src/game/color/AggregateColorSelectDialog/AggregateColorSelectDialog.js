/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './AggregateColorSelectDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import AggregateColorSelect from '../AggregateColorSelect/AggregateColorSelect';
import { closeSelectAggregateColor } from '../../../store/actions/game/gameSelectorActions';

const AggregateColorSelectDialog = ({ closeSelectAggregateColor, onSelectColor, gameFormEditor: { isEyeDropping }}) => {
  function handleClose() {
    closeSelectAggregateColor()
  }

  return <CobrowsingDialog open={!isEyeDropping} onClose={handleClose}>
    <div className="AggregateColorSelectDialog">
      <AggregateColorSelect onSelectColor={onSelectColor}/>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeSelectAggregateColor }),
)(AggregateColorSelectDialog);
