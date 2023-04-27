/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameEditDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeGameEditDialog } from '../../../store/actions/game/gameSelectorActions';
import GameMetadataForm from '../../../app/gameModel/GameMetadataForm/GameMetadataForm';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { GAME_MODEL_IMPORT_IID, GAME_INTERFACE_COLOR_IID, EDIT_GAME_TAB_CONTANER_IID, EDIT_GAME_METADATA_TAB_IID, EDIT_GAME_LIBRARY_TAB_IID, EDIT_GAME_THEME_TAB_IID, EDIT_GAME_SIZE_TAB_IID } from '../../../constants/interfaceIds';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import GameCard from '../../../app/gameModel/GameCard/GameCard';
import { addImportedArcadeGame } from '../../../store/actions/game/arcadeGameActions';
import Alert from '../../../ui/Alert/Alert';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';
import GameSizeEditor from '../../../app/gameModel/GameSizeEditor/GameSizeEditor';

const GameEditDialog = ({ 
  editGameModel, closeGameEditDialog, 
  gameViewEditor: { isSnapshotTakerOpen },
  gameModel: { gameModel },
  addImportedArcadeGame
}) => {
  function handleClose() {
    closeGameEditDialog()
  }

  const metadataTab = {
    interfaceId: EDIT_GAME_METADATA_TAB_IID,
    label: 'General',
    body: <>
      <GameMetadataForm onSubmit={handleClose}/>
    </>
  }

  const themeTab = {
    interfaceId: EDIT_GAME_THEME_TAB_IID,
    label: 'Theme',
    body: <>
      <Unlockable interfaceId={GAME_INTERFACE_COLOR_IID}>
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
    </>
  }

  const libraryTab = {
    interfaceId: EDIT_GAME_LIBRARY_TAB_IID,
    label: 'Library',
    body: <>
       <Unlockable interfaceId={GAME_MODEL_IMPORT_IID}>
        <SelectArcadeGame excludedIds={gameModel.id} removeFilter = {(game) => {
          if(!game.importedArcadeGames || game.importedArcadeGames?.length) return false 
          return true 
        }} label="Import a Game" userMongoId={gameModel.owner.id} onSelect={(games) => {
        if(games[0]) {
          addImportedArcadeGame(games[0].id)
        }
        }}/>
        <FormLabel>Imported Games</FormLabel>
        <div className="GameEditDialog__imported-games">{gameModel.importedArcadeGames?.map((gameModel) => {
          if(gameModel.importedArcadeGames?.length) return <>
            <Alert severity="error">
              {gameModel.metadata.title + ' also has imported games and cannot be imported'}
            </Alert>
          </>
          return <GameCard game={gameModel}/>
        })}
        </div>
      </Unlockable>
    </>
  }

  const sizeTab = {
    interfaceId: EDIT_GAME_SIZE_TAB_IID,
    label: 'Size',
    body: <>
      <GameSizeEditor onSubmit={handleClose}/>
    </>
  }

  const tabs = [metadataTab, themeTab, libraryTab, sizeTab]

  return <CobrowsingDialog widthModifier={1} open={!isSnapshotTakerOpen} onClose={handleClose}>
    <div className="GameEditDialog">
      <CobrowsingTabs className="GameEditDialog__tabs" interfaceGroupId={EDIT_GAME_TAB_CONTANER_IID} tabs={tabs}/>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { closeGameEditDialog, editGameModel, addImportedArcadeGame }),
)(GameEditDialog);
