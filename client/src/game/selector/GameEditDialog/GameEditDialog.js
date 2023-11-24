/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './GameEditDialog.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeGameEditDialog } from '../../../store/actions/game/gameSelectorActions';
import GameMetadataForm from '../../../app/gameModel/GameMetadataForm/GameMetadataForm';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { EDIT_GAME_TAB_CONTANER_IID, EDIT_GAME_METADATA_TAB_IID, EDIT_GAME_LIBRARY_TAB_IID, EDIT_GAME_THEME_TAB_IID, EDIT_GAME_SIZE_TAB_IID, EDIT_GAME_PLAYERS_TAB_IID, PLAYER_ENTITY_IID, EDIT_GAME_PRIVACY_TAB_IID } from '../../../constants/interfaceIds';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import GameCard from '../../../app/gameModel/GameCard/GameCard';
import { addImportedArcadeGame } from '../../../store/actions/game/arcadeGameActions';
import Alert from '../../../ui/Alert/Alert';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';
import GameSizeEditor from '../../../app/gameModel/GameSizeEditor/GameSizeEditor';
import SelectStage from '../../ui/SelectStage/SelectStage';
import Button from '../../../ui/Button/Button';
import { openCreateStageDialog } from '../../../store/actions/game/gameFormEditorActions';
import GamePrivacyForm from '../../../app/gameModel/GamePrivacyForm/GamePrivacyForm';

const GameEditDialog = ({ 
  editGameModel, closeGameEditDialog, 
  gameModel: { gameModel },
  gameFormEditor: { gameModelFormEditor },
  addImportedArcadeGame,
  openCreateStageDialog,
}) => {
  function handleClose() {
    closeGameEditDialog()
  }

  const metadataTab = {
    interfaceId: EDIT_GAME_METADATA_TAB_IID,
    label: 'General',
    body: <>
      <GameMetadataForm/>
    </>
  }

  const privacyTab = {
    interfaceId: EDIT_GAME_PRIVACY_TAB_IID,
    label: 'Privacy',
    body: <>
      <GamePrivacyForm/>
    </>
  }

  const themeTab = {
    interfaceId: EDIT_GAME_THEME_TAB_IID,
    label: 'Theme',
    body: <>
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
    </>
  }

  const libraryTab = {
    interfaceId: EDIT_GAME_LIBRARY_TAB_IID,
    label: 'Library',
    body: <>
      <SelectArcadeGame excludedIds={gameModel.id} label="Select a game to import as a library" userMongoId={gameModel.owner.id} onSelect={async (games) => {
        if(games[0]) {
          await addImportedArcadeGame(games[0].id)
          window.location.reload()
        }
      }}/>
      {/* <FormLabel>Imported Games</FormLabel>
      <div className="GameEditDialog__imported-games">{gameModel.importedArcadeGames?.map((gameModel) => {
        if(gameModel.importedArcadeGames?.length) return <div key={gameModel.id}>
          <Alert severity="error">
            {gameModel.metadata.title + ' also has imported games and cannot be imported'}
          </Alert>
        </div>
        return <GameCard game={gameModel}/>
      })}
      </div> */}
    </>
  }

  const stage = gameModel.stages[gameModel.player.startingStageId]
  const playersTab = {
    interfaceId: EDIT_GAME_PLAYERS_TAB_IID,
    label: 'Stage',
    body: <>
      <SelectStage
        entityModelClass={PLAYER_ENTITY_IID}
        formLabel="What stage should players start on?"
        value={gameModel.player.startingStageId ? [gameModel.player.startingStageId] : []}
        onChange={(event, stageIds) => {
          const newStageId = stageIds[stageIds.length-1]
          editGameModel({ 
            player: {
              startingStageId: newStageId
            }
          })
        }}/>
        <Button onClick={() => {
          openCreateStageDialog(stage)
          handleClose()
        }}>Edit {stage.name}</Button>
      {/* <Divider/>
      <SelectEntityModel
        formLabel="What should the player spawn as? ( Stages can override this )"
        interfaceId={GAME_PLAYER_START_ENTITY_MODEL_IID}
        entityModelClass={PLAYER_ENTITY_IID}
        value={gameModel.player.startingEntityModelId ? [gameModel.player.startingEntityModelId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          editGameModel({ 
            player: {
              startingEntityModelId: newEntityId
            }
          })
        }}/>
      {playerEntity && <Button onClick={() => {
        openEditEntityDialog(playerEntity)
        handleClose()
      }}>Edit {playerEntity.name}</Button>} */}
    </>
  }

  const sizeTab = {
    interfaceId: EDIT_GAME_SIZE_TAB_IID,
    label: 'Size',
    body: <>
      <GameSizeEditor onSubmit={handleClose}/>
    </>
  }

  const tabs = [metadataTab, privacyTab, playersTab, libraryTab, themeTab, sizeTab]

  return <CobrowsingDialog widthModifier={1} open={true} onClose={handleClose}>
    <div className="GameEditDialog">
      <CobrowsingTabs className="GameEditDialog__tabs" interfaceGroupId={EDIT_GAME_TAB_CONTANER_IID} tabs={tabs}/>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { closeGameEditDialog, editGameModel, openCreateStageDialog, addImportedArcadeGame }),
)(GameEditDialog);
