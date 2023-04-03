/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameMetadataModal.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeGameMetadataModal } from '../../../store/actions/game/gameSelectorActions';
import GameMetadataForm from '../GameMetadataForm/GameMetadataForm';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { ADD_ENTITY_MODEL_TO_LIBRARY_IID, GAME_INTERFACE_COLOR_IID } from '../../../constants/interfaceIds';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import Divider from '../../../ui/Divider/Divider';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import GameCard from '../../../app/gameModel/GameCard/GameCard';
import { addImportedArcadeGame } from '../../../store/actions/game/arcadeGameActions';

const GameMetadataModal = ({ 
  editGameModel, closeGameMetadataModal, 
  gameViewEditor: { isSnapshotTakerOpen },
  gameModel: { gameModel },
  addImportedArcadeGame
}) => {
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
          selectedColor={gameModel.theme.primaryColor}
          onSelectColor={(hexString) => {
            editGameModel({ theme: {
              primaryColor: hexString
            }})
          }}
        />
      </Unlockable>
      <Unlockable interfaceId={ADD_ENTITY_MODEL_TO_LIBRARY_IID}>
        <Divider/>
        <SelectArcadeGame excludedIds={gameModel.id} label="Import a Game" userMongoId={gameModel.owner.id} onSelect={(games) => {
        if(games[0]) {
          addImportedArcadeGame(games[0].id)
        }
        }}/>
        <FormLabel>Imported Games</FormLabel>
        <div className="GameMetadataModal__imported-games">{gameModel.importedArcadeGames?.map((gameModel) => {
          return <GameCard game={gameModel}/>
        })}
        </div>
      </Unlockable>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
  gameModel: state.gameModel,

})

export default compose(
  connect(mapStateToProps, { closeGameMetadataModal, editGameModel, addImportedArcadeGame }),
)(GameMetadataModal);
