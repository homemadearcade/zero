/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameMetadataModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeGameMetadataModal } from '../../../store/actions/gameSelectorActions';
import GameMetadataForm from '../GameMetadataForm/GameMetadataForm';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../../store/actions/gameModelActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { GAME_INTERFACE_COLOR_IID } from '../../../constants/interfaceIds';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import Divider from '../../../ui/Divider/Divider';

const GameMetadataModal = ({ editGameModel, closeGameMetadataModal, gameViewEditor: { isSnapshotTakerOpen }, gameModel: { gameModel } }) => {
  function handleClose() {
    closeGameMetadataModal()
  }

  return <CobrowsingModal open={!isSnapshotTakerOpen} onClose={handleClose}>
    <div className="GameMetadataModal">
      <GameMetadataForm onSubmit={handleClose}/>
      <Unlockable interfaceId={GAME_INTERFACE_COLOR_IID}>
        <Divider/>
        <FormLabel>
          Interface Color
        </FormLabel>
        <AggregateColorSelect
          selectedColor={gameModel.metadata.interfaceColor}
          onSelectColor={(hexString) => {
            editGameModel({ metadata: {
              interfaceColor: hexString
            }})
          }}
        />
      </Unlockable>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
  gameModel: state.gameModel
})

export default compose(
  connect(mapStateToProps, { closeGameMetadataModal, editGameModel }),
)(GameMetadataModal);
