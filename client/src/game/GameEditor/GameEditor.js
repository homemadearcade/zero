import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import LiveEditor from '../instantEditor/LiveEditor/LiveEditor';
import { clearEditor, closeJsonViewer } from '../../store/actions/gameEditorActions';
import { clearGameFormEditor } from '../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../store/actions/gameViewEditorActions';
import SectionEditor from '../stages/SectionEditor/SectionEditor';
import SnapshotTaker from '../sprites/SnapshotTaker/SnapshotTaker';
import SelectBackgroundColor from '../stages/SelectBackgroundColor/SelectBackgroundColor';
import { Constellation } from '../../app/homemadeArcade/Constellation/Constellation';
import { BRUSH_ID_PREFIX, PLAYTHROUGH_PLAY_STATE, START_STATE } from '../constants';
import GameMetadataModal from '../GameMetadataModal/GameMetadataModal';
import CutscenesMenu from '../cutscene/CutscenesMenu/CutscenesMenu';
import CreateCutscene from '../cutscene/CreateCutscene/CreateCutscene';
import CreateRelation from '../relations/CreateRelation/CreateRelation';
import RelationsMenu from '../relations/RelationsMenu/RelationsMenu';
import BoundaryRelation from '../relations/BoundaryRelation/BoundaryRelation';
import ClassNameModal from '../class/ClassNameModal/ClassNameModal';
import SetupDefaultsModal from '../SetupDefaultsModal/SetupDefaultsModal';
import GridToggle from '../GridToggle/GridToggle';
import GameStateToolbar from '../GameStateToolbar/GameStateToolbar';
import ClassList from '../class/ClassList/ClassList';
import BrushList from '../brush/BrushList/BrushList';
import Dialog from '../../ui/Dialog/Dialog';
import StagesMenu from '../stages/StagesMenu/StagesMenu';
import CreateStage from '../stages/CreateStage/CreateStage';
import Unlockable from '../cobrowsing/Unlockable/Unlockable';
import CreateBrushFlow from '../brush/CreateBrushFlow/CreateBrushFlow';
import { generateUniqueId } from '../../utils/webPageUtils';
import { editGameModel } from '../../store/actions/gameModelActions';
import GridViewArrows from '../GridViewArrows/GridViewArrows';
import Icon from '../../ui/Icon/Icon';
import { INSTANCE_TOOLBAR_CONTAINER_IID } from '../../constants/interfaceIds';

const GameEditor = ({ 
  classNames, 
  gameEditor: { isSetupDefaultsModalOpen, isSelectBackgroundColorOpen, classIdEditingName, liveEditingCategory, isGameMetadataModalOpen, viewingJson }, 
  gameViewEditor: { isSectionEditorOpen, isSnapshotTakerOpen, isGridViewOn }, 
  gameContext: { isConstellationOpen, isConstellationClosing, constellationZoomImageFile }, 
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
  gameContext: { gameState },
  gameModel: { gameModel },
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
  }, [])

  const showColumns = !isSectionEditorOpen && (gameState !== PLAYTHROUGH_PLAY_STATE && gameState !== START_STATE) && !isSnapshotTakerOpen

  function renderBody() {
    if(!gameModel) {
      return <div className="GameView__empty">
        <Icon icon="faCircleQuestion"></Icon>
        No Game Loaded
      </div>
    }

    return <>
      {isConstellationOpen && <Constellation className="Constellation--overlay" zoomOut zoomIn={isConstellationClosing} zoomOutImage={constellationZoomImageFile} />}
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
        {viewingJson.sprite.x}<br/><br/>
        {viewingJson.sprite.y}<br/><br/>
        {viewingJson.reclassId}<br/><br/>
        {viewingJson.destroyAfterUpdate}<br/><br/>
        {viewingJson.id}<br/><br/>
        {viewingJson.classId}<br/><br/>
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

  return <>
    <div className={"GameEditor " + classNames}>
      {renderBody()}
    </div>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameEditor: state.gameEditor,
  gameViewEditor: state.gameViewEditor,
  gameFormEditor: state.gameFormEditor,
  gameContext: state.gameContext,
  gameModel: state.gameModel
})

export default connect(mapStateToProps, { 
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor, 
  closeJsonViewer,
  editGameModel,
})(GameEditor);