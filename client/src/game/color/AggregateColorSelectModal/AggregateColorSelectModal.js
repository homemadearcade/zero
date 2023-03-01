/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './AggregateColorSelectModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import AggregateColorSelect from '../AggregateColorSelect/AggregateColorSelect';
import { closeSelectAggregateColor } from '../../../store/actions/gameSelectorActions';

const AggregateColorSelectModal = ({ closeSelectAggregateColor, onSelectColor, gameFormEditor: { isEyeDropping }}) => {
  function handleClose() {
    closeSelectAggregateColor()
  }

  return <CobrowsingModal open={!isEyeDropping} onClose={handleClose}>
    <div className="AggregateColorSelectModal">
      <Typography component="h2" variant="h2">Background Color</Typography>
      <AggregateColorSelect onSelectColor={onSelectColor}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeSelectAggregateColor }),
)(AggregateColorSelectModal);
