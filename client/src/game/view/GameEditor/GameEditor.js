import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';
import ReactJson from 'react-json-view'

import { clearEditor, closeJsonViewer } from '../../../store/actions/game/gameSelectorActions';
import { clearGameFormEditor } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../../store/actions/game/gameViewEditorActions';
import SectionEditor from '../../stages/SectionEditor/SectionEditor';
import SnapshotTaker from '../../textures/SnapshotTaker/SnapshotTaker';
import SelectStageColorDialog from '../../stages/SelectStageColorDialog/SelectStageColorDialog';
import { BRUSH_DID, PLAYTHROUGH_PLAY_STATE, START_STATE } from '../../constants';
import GameMetadataDialog from '../../selector/GameMetadataDialog/GameMetadataDialog';
import CutscenesMenu from '../../cutscene/CutscenesMenu/CutscenesMenu';
import CreateCutscene from '../../cutscene/CreateCutscene/CreateCutscene';
import BoundaryRelation from '../../entityModel/BoundaryRelation/BoundaryRelation';
import EditEntityDialog from '../../entityModel/EditEntityDialog/EditEntityDialog';
import GridToggle from '../GridToggle/GridToggle';
import GameStateToolbar from '../../gameRoomInstance/GameStateToolbar/GameStateToolbar';
import EntityList from '../../entityModel/EntityList/EntityList';
import BrushList from '../../brush/BrushList/BrushList';
import Dialog from '../../../ui/Dialog/Dialog';
import StagesMenu from '../../stages/StagesMenu/StagesMenu';
import CreateStageDialog from '../../stages/CreateStageDialog/CreateStageDialog';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CreateBrushFlow from '../../brush/CreateBrushFlow/CreateBrushFlow';
import { copyToClipboard, generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import GridViewArrows from '../GridViewArrows/GridViewArrows';
import { EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, INSTANCE_TOOLBAR_CONTAINER_IID, SELECTOR_ABSTRACT_LIST_IID, SELECTOR_ENTITY_BY_INTERFACE_ID_IID } from '../../../constants/interfaceIds';
import EntityBoxDialog from '../../entityModel/EntityBoxDialog/EntityBoxDialog';
import HoverPreview from '../../selector/HoverPreview/HoverPreview';
import LiveEditor from '../../instantEditor/LiveEditor/LiveEditor';
import Button from '../../../ui/Button/Button';
import SelectorAbstractList from '../../selector/SelectorAbstractList/SelectorAbstractList';
import CreateRelationTag from '../../tags/CreateRelationTag/CreateRelationTag';
import CreateRelation from '../../relations/CreateRelation/CreateRelation';
import CreateEffectDialog from '../../effect/CreateEffectDialog/CreateEffectDialog';
import CreateEventDialog from '../../event/CreateEventDialog/CreateEventDialog';
import GameViewObscured from '../GameViewObscured/GameViewObscured';
import GameView from '../GameView/GameView';
import EditEntityGraphics from '../../entityModel/EditEntityGraphics/EditEntityGraphics';
// import ParticlesTest from '../../../experience/particles/ParticlesTest/ParticlesTest';

const GameEditor = ({ 
  classNames, 
  gameSelector: { 
    isEntityBoxDialogOpen, 
    isSelectStageColorDialogOpen, 
    liveEditingCategory, 
    isGameMetadataDialogOpen, 
    currentSelectorListInterfaceId,
    viewingJson }, 
  gameViewEditor: { 
    isSectionEditorOpen, 
    isSnapshotTakerOpen, 
    isGridViewOn }, 
  gameFormEditor: { 
    isEditEntityGraphicsOpen,
    isEditEntityDialogOpen, 
    isCreateRelationTagOpen, 
    isCreateRelationOpen,
    isCreateCutsceneOpen, 
    isCreateBrushFlowOpen, 
    isCreateStageDialogOpen, 
    isCutscenesMenuOpen, 
    isBoundaryRelationOpen, 
    isCreateEffectOpen,
    isStagesMenuOpen,
    isCreateEventOpen
  },
  leftColumnRef, 
  rightColumnRef, 
  leftColumn, 
  rightColumn, 
  editGameModel,
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor,
  closeJsonViewer,
  isObscurable,
  rootFontSize,
  children,
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

  const showColumns = !cutsceneId && !isSectionEditorOpen && (gameState !== PLAYTHROUGH_PLAY_STATE && gameState !== START_STATE) && !isSnapshotTakerOpen

  function renderSelectorColumn() {
    if(currentSelectorListInterfaceId === SELECTOR_ABSTRACT_LIST_IID) {
      return <SelectorAbstractList/>
    } 
    if(currentSelectorListInterfaceId === SELECTOR_ENTITY_BY_INTERFACE_ID_IID) {
      return <EntityList/>
    } 
  }

  function renderOverlay() {
    return <>
      {isSectionEditorOpen && <SectionEditor/>}
      {isSnapshotTakerOpen && <SnapshotTaker/>}
      {isGridViewOn && !isSectionEditorOpen && !isSnapshotTakerOpen && <GridViewArrows/>}
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
          <GridToggle/>
          <BrushList/>
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
        <HoverPreview></HoverPreview>
        {showColumns && gameModel && <>
          {renderSelectorColumn()}
        </>}
      </div>
      {liveEditingCategory && <LiveEditor></LiveEditor>}
      {isEntityBoxDialogOpen && <EntityBoxDialog/>}
      {isGameMetadataDialogOpen && <GameMetadataDialog/>}
      {isEditEntityDialogOpen && <EditEntityDialog/>}
      {isCutscenesMenuOpen && <CutscenesMenu/>}
      {isCreateCutsceneOpen && <CreateCutscene/>}
      {isBoundaryRelationOpen && <BoundaryRelation/>}
      {isCreateRelationOpen && <CreateRelation/>}
      {isCreateEffectOpen && <CreateEffectDialog/>}
      {isCreateEventOpen && <CreateEventDialog/>}
      {isCreateRelationTagOpen && <CreateRelationTag/>}
      {isStagesMenuOpen && <StagesMenu/>}
      {isCreateStageDialogOpen && <CreateStageDialog/>}
      {isSelectStageColorDialogOpen && <SelectStageColorDialog/>}
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
      <div id="CobrowsingDialog"></div>
      {viewingJson && <Dialog onClose={closeJsonViewer} open>
        <Button onClick={() => {
          copyToClipboard(JSON.stringify(viewingJson))
        }} >Copy to clipboard</Button>
        <ReactJson src={viewingJson} theme="monokai" />
      </Dialog>}
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
  editGameModel,
})(GameEditor);