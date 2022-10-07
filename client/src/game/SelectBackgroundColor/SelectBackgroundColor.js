/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectBackgroundColor.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import Typography from '../../app/ui/Typography/Typography';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { closeSelectBackgroundColor } from '../../store/actions/editorActions';
import AggregateColorSelect from '../AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../store/actions/gameActions';

const SelectBackgroundColor = ({ closeSelectBackgroundColor, editGameModel, gameFormEditor: { color} }) => {
  function handleClose() {
    closeSelectBackgroundColor()
  }

  return <CobrowsingModal open={!color.isEyeDropping} onClose={handleClose}>
    <div className="SelectBackgroundColor">
      <Typography component="h2" variant="h2">Background Color</Typography>
      <AggregateColorSelect onSelectColor={(hex) => {
        editGameModel({
          world: {
            backgroundColor: hex
          }
        })
        closeSelectBackgroundColor()
      }}/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
  gameFormEditor: state.gameFormEditor,
  game: state.game
})

export default compose(
  connect(mapStateToProps, { closeSelectBackgroundColor, editGameModel }),
)(SelectBackgroundColor);
