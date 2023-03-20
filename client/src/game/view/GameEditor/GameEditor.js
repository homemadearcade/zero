import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';
import ReactJson from 'react-json-view'

import { clearEditor, closeJsonViewer } from '../../../store/actions/gameSelectorActions';
import { clearGameFormEditor, closeCreateEffect, closeCreateEvent } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../../store/actions/gameViewEditorActions';
import SectionEditor from '../../stages/SectionEditor/SectionEditor';
import SnapshotTaker from '../../sprites/SnapshotTaker/SnapshotTaker';
import SelectBackgroundColorModal from '../../stages/SelectBackgroundColorModal/SelectBackgroundColorModal';
import { BRUSH_ID_PREFIX, PLAYTHROUGH_PLAY_STATE, SELECTOR_ABSTRACT_LIST, SELECTOR_MAP_LIST, START_STATE } from '../../constants';
import GameMetadataModal from '../../selector/GameMetadataModal/GameMetadataModal';
import CutscenesMenu from '../../cutscene/CutscenesMenu/CutscenesMenu';
import CreateCutscene from '../../cutscene/CreateCutscene/CreateCutscene';
import BoundaryRelation from '../../class/BoundaryRelation/BoundaryRelation';
import EditClassModal from '../../class/EditClassModal/EditClassModal';
import SetupDefaultsModal from '../../SetupDefaultsModal/SetupDefaultsModal';
import GridToggle from '../GridToggle/GridToggle';
import GameStateToolbar from '../../gameRoom/GameStateToolbar/GameStateToolbar';
import ClassList from '../../class/ClassList/ClassList';
import BrushList from '../../brush/BrushList/BrushList';
import Dialog from '../../../ui/Dialog/Dialog';
import StagesMenu from '../../stages/StagesMenu/StagesMenu';
import CreateStage from '../../stages/CreateStage/CreateStage';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import CreateBrushFlow from '../../brush/CreateBrushFlow/CreateBrushFlow';
import { copyToClipboard, generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import GridViewArrows from '../GridViewArrows/GridViewArrows';
import { INSTANCE_TOOLBAR_CONTAINER_IID } from '../../../constants/interfaceIds';
import ClassBoxModal from '../../class/ClassBoxModal/ClassBoxModal';
import HoverPreview from '../../selector/HoverPreview/HoverPreview';
import LiveEditor from '../../instantEditor/LiveEditor/LiveEditor';
import Button from '../../../ui/Button/Button';
import SelectorAbstractList from '../../selector/SelectorAbstractList/SelectorAbstractList';
import CreateTag from '../../tags/CreateTag/CreateTag';
import CreateRelation from '../../relations/CreateRelation/CreateRelation';
import CreateEffectModal from '../../effect/CreateEffectModal/CreateEffectModal';
import CreateEventModal from '../../event/CreateEventModal/CreateEventModal';
// import ParticlesTest from '../../../experience/particles/ParticlesTest/ParticlesTest';

const GameEditor = ({ 
  classNames, 
  gameSelector: { 
    isClassBoxModalOpen, 
    isSetupDefaultsModalOpen, 
    isSelectBackgroundColorModalOpen, 
    liveEditingCategory, 
    isGameMetadataModalOpen, 
    currentSelectorList,
    viewingJson }, 
  gameViewEditor: { 
    isSectionEditorOpen, 
    isSnapshotTakerOpen, 
    isGridViewOn }, 
  gameFormEditor: { 
    isEditClassModalOpen, 
    isCreateTagOpen, 
    isCreateRelationOpen,
    isCreateCutsceneOpen, 
    isCreateBrushFlowOpen, 
    isCreateStageOpen, 
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
  children, 
  editGameModel,
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor,
  closeJsonViewer,
  closeCreateEffect,
  closeCreateEvent,
  gameRoom: { gameRoom: { gameState } },
  gameModel: { gameModel, isLoading },
  playerInterface: { cutsceneId }
}) => {
  useEffect(() => {
    const ogStyle = document.documentElement.style
    document.documentElement.style="font-size: 2vh";
    
    return () => {
      clearEditor()
      clearGameFormEditor()
      clearGameViewEditor()
      document.documentElement.style = ogStyle
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showColumns = !cutsceneId && !isSectionEditorOpen && (gameState !== PLAYTHROUGH_PLAY_STATE && gameState !== START_STATE) && !isSnapshotTakerOpen

  function renderSelectorColumn() {
    if(currentSelectorList === SELECTOR_ABSTRACT_LIST) {
      return <SelectorAbstractList/>
    } 
    if(currentSelectorList === SELECTOR_MAP_LIST) {
      return <ClassList/>
    } 
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
      {children}
      <div className="GameEditor__overlay">
        {isSectionEditorOpen && <SectionEditor/>}
        {isSnapshotTakerOpen && <SnapshotTaker/>}
        {isGridViewOn && !isSectionEditorOpen && !isSnapshotTakerOpen && <GridViewArrows/>}
      </div>
      <div id="GameEditor__right-column" ref={rightColumnRef} className="GameEditor__right-column">
        <Unlockable interfaceId={INSTANCE_TOOLBAR_CONTAINER_IID}><GameStateToolbar/></Unlockable>
        {showColumns && gameModel && <>
          <HoverPreview></HoverPreview>
          {renderSelectorColumn()}
        </>}
      </div>
      {liveEditingCategory && <LiveEditor></LiveEditor>}
      {isClassBoxModalOpen && <ClassBoxModal/>}
      {isGameMetadataModalOpen && <GameMetadataModal/>}
      {isEditClassModalOpen && <EditClassModal/>}
      {isCutscenesMenuOpen && <CutscenesMenu/>}
      {isCreateCutsceneOpen && <CreateCutscene/>}
      {isBoundaryRelationOpen && <BoundaryRelation/>}
      {isCreateRelationOpen && <CreateRelation/>}
      {isCreateEffectOpen && <CreateEffectModal/>}
      {isCreateEventOpen && <CreateEventModal/>}
      {isCreateTagOpen && <CreateTag/>}
      {isStagesMenuOpen && <StagesMenu/>}
      {isCreateStageOpen && <CreateStage/>}
      {isSetupDefaultsModalOpen && <SetupDefaultsModal/>}
      {isSelectBackgroundColorModalOpen && <SelectBackgroundColorModal/>}
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
                    [brush.layerCanvasId]: Date.now()
                  }
                }
              })
            }
          } else {
            const brushId = BRUSH_ID_PREFIX+generateUniqueId()
            editGameModel({
              brushes: {
                [brushId] : brush
              }
            })
          }
     }}/>}
    </>
  }

  return <div className={"GameEditor " + classNames}>
    {renderBody()}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameViewEditor: state.gameViewEditor,
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
  gameRoom: state.gameRoom,
  playerInterface: state.playerInterface
})

export default connect(mapStateToProps, { 
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor, 
  closeJsonViewer,
  closeCreateEvent,
  closeCreateEffect,
  editGameModel,
})(GameEditor);