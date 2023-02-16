import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';
import ReactJson from 'react-json-view'

import LiveEditor from '../../instantEditor/LiveEditor/LiveEditor';
import { clearEditor, closeJsonViewer } from '../../../store/actions/gameSelectorActions';
import { clearGameFormEditor } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../../store/actions/gameViewEditorActions';
import SectionEditor from '../../stages/SectionEditor/SectionEditor';
import SnapshotTaker from '../../sprites/SnapshotTaker/SnapshotTaker';
import SelectBackgroundColor from '../../stages/SelectBackgroundColor/SelectBackgroundColor';
import { BRUSH_ID_PREFIX, PLAYTHROUGH_PLAY_STATE, START_STATE } from '../../constants';
import GameMetadataModal from '../../GameMetadataModal/GameMetadataModal';
import CutscenesMenu from '../../cutscene/CutscenesMenu/CutscenesMenu';
import CreateCutscene from '../../cutscene/CreateCutscene/CreateCutscene';
import CreateRelation from '../../relations/CreateRelation/CreateRelation';
import RelationsMenu from '../../relations/RelationsMenu/RelationsMenu';
import BoundaryRelation from '../../relations/BoundaryRelation/BoundaryRelation';
import ClassNameModal from '../../class/ClassNameModal/ClassNameModal';
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
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import GridViewArrows from '../GridViewArrows/GridViewArrows';
import Icon from '../../../ui/Icon/Icon';
import { INSTANCE_TOOLBAR_CONTAINER_IID } from '../../../constants/interfaceIds';
import GameViewEmpty from '../GameViewEmpty/GameViewEmpty';

const GameEditor = ({ 
  classNames, 
  gameSelector: { isSetupDefaultsModalOpen, isSelectBackgroundColorOpen, classIdEditingName, liveEditingCategory, isGameMetadataModalOpen, viewingJson }, 
  gameViewEditor: { isSectionEditorOpen, isSnapshotTakerOpen, isGridViewOn }, 
  gameFormEditor: { isCreateCutsceneOpen, isCreateBrushFlowOpen, isCreateStageOpen, isCutscenesMenuOpen, isCreateRelationOpen, isRelationsMenuOpen, isBoundaryRelationOpen, isStagesMenuOpen },
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
  gameRoom: { gameRoom: { gameState } },
  gameModel: { gameModel, isLoading },
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

  const showColumns = !isSectionEditorOpen && (gameState !== PLAYTHROUGH_PLAY_STATE && gameState !== START_STATE) && !isSnapshotTakerOpen

  function renderBody() {
    if(!gameModel && !isLoading) {
      return <GameViewEmpty>
        <Icon icon="faCircleQuestion"></Icon>
        No Game Loaded
      </GameViewEmpty>
    }

    return <>
      <div id="GameEditor__left-column" ref={leftColumnRef} className="GameEditor__left-column">
        {leftColumn}
        {showColumns && <>
          <GridToggle/>
          {gameModel && <BrushList/>}
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
          <ClassList/>
        </>}
      </div>
      {liveEditingCategory && <LiveEditor/>}
      {isGameMetadataModalOpen && <GameMetadataModal/>}
      {classIdEditingName && <ClassNameModal/>}
      {isCutscenesMenuOpen && <CutscenesMenu/>}
      {isCreateCutsceneOpen && <CreateCutscene/>}
      {isRelationsMenuOpen && <RelationsMenu/>}
      {isCreateRelationOpen && <CreateRelation/>}
      {isBoundaryRelationOpen && <BoundaryRelation/>}
      {isStagesMenuOpen && <StagesMenu/>}
      {isCreateStageOpen && <CreateStage/>}
      {isSetupDefaultsModalOpen && <SetupDefaultsModal/>}
      {isSelectBackgroundColorOpen && <SelectBackgroundColor/>}
      {viewingJson && <Dialog onClose={closeJsonViewer} open>
        <ReactJson src={viewingJson} theme="monokai" />
      </Dialog>}
      {isCreateBrushFlowOpen && <CreateBrushFlow 
        onComplete={(brush) => {
          if(!brush.textureId) {   
            if(brush.tint) {
              editGameModel({
                colors: {
                  [brush.tint]: {
                    [brush.canvasId]: true
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
  gameRoom: state.gameRoom
})

export default connect(mapStateToProps, { 
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor, 
  closeJsonViewer,
  editGameModel,
})(GameEditor);