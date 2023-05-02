import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';
import ReactJson from 'react-json-view'

import { clearEditor, closeJsonViewer, selectBrush } from '../../../store/actions/game/gameSelectorActions';
import { clearGameFormEditor, closeEditEntityGraphics, updateCreateBrush } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../../store/actions/game/gameViewEditorActions';
import BoundaryEditor from '../../stages/BoundaryEditor/BoundaryEditor';
import SnapshotTaker from '../../textures/SnapshotTaker/SnapshotTaker';
import { BRUSH_DID, PLAYTHROUGH_PLAY_STATE, GAME_START_STATE, COLOR_BRUSH_ID } from '../../constants';
import GameEditDialog from '../../selector/GameEditDialog/GameEditDialog';
import CreateCutscene from '../../cutscene/CreateCutscene/CreateCutscene';
import EditEntityDialog from '../../entityModel/EditEntityDialog/EditEntityDialog';
import GridToggle from '../GridToggle/GridToggle';
import GameStateToolbar from '../../gameRoomInstance/GameStateToolbar/GameStateToolbar';
import EntityList from '../../entityModel/EntityList/EntityList';
import BrushList from '../../brush/BrushList/BrushList';
import Dialog from '../../../ui/Dialog/Dialog';
import CreateStageDialog from '../../stages/CreateStageDialog/CreateStageDialog';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CreateBrushFlow from '../../brush/CreateBrushFlow/CreateBrushFlow';
import { copyToClipboard, generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import GridViewArrows from '../GridViewArrows/GridViewArrows';
import {  EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID,
   INSTANCE_TOOLBAR_CONTAINER_IID, LAYER_CREATE_COLOR_DIALOG_IID, 
   SELECTOR_RELATION_SYSTEM_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID } from '../../../constants/interfaceIds';
import EntityBoxDialog from '../../entityModel/EntityBoxDialog/EntityBoxDialog';
import HoverPreview from '../../selector/HoverPreview/HoverPreview';
import EntityBehaviorLiveEditor from '../../behaviors/EntityBehaviorLiveEditor/EntityBehaviorLiveEditor';
import Button from '../../../ui/Button/Button';
import CreateRelationTag from '../../tags/CreateRelationTag/CreateRelationTag';
import CreateRelation from '../../relations/CreateRelation/CreateRelation';
import CreateEffectDialog from '../../effect/CreateEffectDialog/CreateEffectDialog';
import CreateEventDialog from '../../event/CreateEventDialog/CreateEventDialog';
import GameViewObscured from '../GameViewObscured/GameViewObscured';
import GameView from '../GameView/GameView';
import EditEntityGraphics from '../../entityModel/EditEntityGraphics/EditEntityGraphics';
import EffectPromptDialog from '../../effect/EffectPromptDialog/EffectPromptDialog';
import CanvasImageDialog from '../../textures/CanvasImageDialog/CanvasImageDialog';
import CreateColorFlow from '../../color/CreateColorFlow/CreateColorFlow';
import StageLiveEditor from '../../stages/StageLiveEditor/StageLiveEditor';
import EditRelationSystemDialog from '../../relations/EditRelationSystemDialog/EditRelationSystemDialog';
import EditContentDialog from '../../content/EditContentDialog/EditContentDialog';
import ClickPreview from '../../selector/ClickPreview/ClickPreview';
import KeyToolbar from '../../selector/KeyToolbar/KeyToolbar';
// import ParticlesTest from '../../../experience/particles/ParticlesTest/ParticlesTest';

const GameEditor = ({ 
  classNames, 
  gameSelector: { 
    isEntityBoxDialogOpen, 
    isEntityBehaviorLiveEditorOpen, 
    isStageLiveEditorOpen,
    isGameEditDialogOpen, 
    currentSelectorListInterfaceId,
    viewingJson }, 
  gameViewEditor: { 
    isBoundaryEditorOpen, 
    isSnapshotTakerOpen, 
    isGridViewOn 
  }, 
  gameFormEditor: { 
    canvasImageEntityModelId,
    isCanvasImageDialogOpen,
    isEffectPromptDialogOpen,
    isEditEntityGraphicsOpen,
    isEditEntityDialogOpen, 
    isEditContentDialogOpen,
    isEditRelationSystemDialogOpen,
    isCreateRelationTagOpen, 
    isCreateRelationOpen,
    isCreateCutsceneOpen, 
    isCreateColorFlowOpen,
    isCreateBrushFlowOpen, 
    isCreateStageDialogOpen, 
    isCreateEffectOpen,
    isCreateEventOpen
  },
  leftColumnRef, 
  rightColumnRef, 
  leftColumn, 
  rightColumn, 
  editGameModel,
  clearEditor, 
  clearGameFormEditor, 
  closeEditEntityGraphics,
  clearGameViewEditor,
  closeJsonViewer,
  isObscurable,
  rootFontSize,
  children,
  selectBrush,
  updateCreateBrush,
  gameRoomInstance: { gameRoomInstance: { gameState } },
  gameModel: { gameModel },
  playerInterface: { cutsceneId }
}) => {
  useEffect(() => {   
    setTimeout(() => {
      document.getElementById('GameEditor').style =`font-size: ${rootFontSize || '2vh'}`;
    })
  }, [rootFontSize])

  useEffect(() => {
    return () => {
      clearEditor()
      clearGameFormEditor()
      clearGameViewEditor()
      // document.getElementById('GameEditor').style  = ogStyle
    }
  }, [])

  const showColumns = !cutsceneId && !isBoundaryEditorOpen && (gameState !== PLAYTHROUGH_PLAY_STATE && gameState !== GAME_START_STATE) && !isSnapshotTakerOpen

  function renderSelectorColumn() {
    if(currentSelectorListInterfaceId === SELECTOR_ENTITY_BY_INTERFACE_ID_IID) {
      return <EntityList/>
    } 
  }

  function renderOverlay() {
    return <>
      {isBoundaryEditorOpen && <BoundaryEditor/>}
      {isSnapshotTakerOpen && <SnapshotTaker/>}
      {isGridViewOn && !isBoundaryEditorOpen && !isSnapshotTakerOpen && <GridViewArrows/>}
    </>
  }

  function renderBody() {
    // if(!gameModel && !isLoading) {
    //   return <GameViewEmpty>
    //     <Icon icon="faCircleQuestion"></Icon>
    //     No Game Loaded
    //     <GameLoadButton></GameLoadButton>
    //   </GameViewEmpty>
    // }
          // {gameModel && <SideEditor></SideEditor>}

    return <>
      <div id="GameEditor__left-column" ref={leftColumnRef} className="GameEditor__left-column">
        {leftColumn}
        {showColumns && <>
          <BrushList/>
          <KeyToolbar/>
        </>}
      </div>
      {isObscurable ? <GameViewObscured>
        {renderOverlay()}
      </GameViewObscured> : <GameView>
        {renderOverlay()}
      </GameView>}
      {children}
      <div id="GameEditor__right-column" ref={rightColumnRef} className="GameEditor__right-column">
        <Unlockable interfaceId={INSTANCE_TOOLBAR_CONTAINER_IID}><GameStateToolbar/></Unlockable>
        <HoverPreview/>
        <ClickPreview/>
        {showColumns && gameModel && <>
          {renderSelectorColumn()}
        </>}
      </div>
      
      <div id="CobrowsingDialog"></div>

      {/* TABBED DIALOGS */}
      {isEntityBehaviorLiveEditorOpen && <EntityBehaviorLiveEditor/>}
      {isStageLiveEditorOpen && <StageLiveEditor/>}

      {isGameEditDialogOpen && <GameEditDialog/>}
      {isEditEntityDialogOpen && <EditEntityDialog/>}     
      {isEditRelationSystemDialogOpen && <EditRelationSystemDialog/>}
      {isEditContentDialogOpen && <EditContentDialog/>}


      {/* CREATE CONTENT DIALOGS */}
      {isCreateCutsceneOpen && <CreateCutscene/>}
      {isCreateStageDialogOpen && <CreateStageDialog/>}

      {/* CREATE  DIALOGS */}
      {isCreateRelationOpen && <CreateRelation/>}
      {isCreateEffectOpen && <CreateEffectDialog/>}
      {isCreateEventOpen && <CreateEventDialog/>}
      {isCreateRelationTagOpen && <CreateRelationTag/>}

      {/* MISC DIALOGS */}
      {isEntityBoxDialogOpen && <EntityBoxDialog/>}
      {isEffectPromptDialogOpen && <EffectPromptDialog/>}
      {viewingJson && <Dialog onClose={closeJsonViewer} open>
        <Button onClick={() => {
          copyToClipboard(JSON.stringify(viewingJson))
        }} >Copy to clipboard</Button>
        <ReactJson src={viewingJson} theme="monokai" />
      </Dialog>}


      {/* GRAPHICS DIALOGS */}
      {isCreateColorFlowOpen === LAYER_CREATE_COLOR_DIALOG_IID && <CreateColorFlow
        onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [color.layerId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + color.layerId + '/' + color.hex, color.layerId)
      }}/>}
      {isCreateBrushFlowOpen && <CreateBrushFlow 
        onComplete={(brush) => {
          if(!brush.textureId) {   
            if(brush.textureTint) {
              editGameModel({
                colors: {
                  [brush.textureTint]: {
                    [brush.layerId]: Date.now()
                  }
                }
              })
            }
          } else {
            const brushId = BRUSH_DID+generateUniqueId()
            editGameModel({
              brushes: {
                [brushId] : brush
              }
            })
          }
     }}/>}
    {isEditEntityGraphicsOpen === EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID && <EditEntityGraphics 
        onComplete={(entityModel) => {
          editGameModel({
            entityModels: {
              [entityModel.entityModelId] : {
                // must be a spread operator here because when this is opened it has a lot of properties brought in from some defaults
                ...entityModel,
                isNew: false,
                isImported: true
                // graphics: entityModel.graphics,
                // editorInterface: entityModel.editorInterface,
                // visualTags: entityModel.visualTags,
                // name: entityModel.name,
              }
            }
          })
        }}
      />}
      {isCanvasImageDialogOpen && <CanvasImageDialog onSaveCanvasImage={(textureId) => {
        if(canvasImageEntityModelId) {
          closeEditEntityGraphics()

          editGameModel({
            entityModels: {
              [canvasImageEntityModelId] : {
                graphics: {
                  textureId,
                  textureTint: null
                }
              }
            }
          })
        } else if(isCreateBrushFlowOpen) {
          updateCreateBrush({
            textureId,
          })
        }
      }} />}
    </>
  }

  return <div id="GameEditor" className={"GameEditor " + classNames}>
    {renderBody()}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameViewEditor: state.gameViewEditor,
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
  gameRoomInstance: state.gameRoomInstance,
  playerInterface: state.playerInterface
})

export default connect(mapStateToProps, { 
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor, 
  closeJsonViewer,
  updateCreateBrush,
  closeEditEntityGraphics,
  editGameModel,
  selectBrush,
})(GameEditor);