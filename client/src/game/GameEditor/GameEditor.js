import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import LiveEditor from '../instantEditor/LiveEditor/LiveEditor';
import { clearEditor } from '../../store/actions/gameEditorActions';
import { clearGameFormEditor } from '../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../store/actions/gameViewEditorActions';
import SectionEditor from '../world/SectionEditor/SectionEditor';
import SnapshotTaker from '../sprites/SnapshotTaker/SnapshotTaker';
import SelectBackgroundColor from '../world/SelectBackgroundColor/SelectBackgroundColor';
import { Constellation } from '../../app/homemadeArcade/Constellation/Constellation';
import { EDIT_STATE } from '../constants';
import { changeGameState } from '../../store/actions/gameContextActions';
import GameMetadataModal from '../GameMetadataModal/GameMetadataModal';
import CutscenesMenu from '../cutscene/CutscenesMenu/CutscenesMenu';
import CreateCutscene from '../cutscene/CreateCutscene/CreateCutscene';
import CreateRelation from '../relations/CreateRelation/CreateRelation';
import RelationsMenu from '../relations/RelationsMenu/RelationsMenu';
import WorldRelation from '../relations/WorldRelation/WorldRelation';
import ClassNameModal from '../class/ClassNameModal/ClassNameModal';
import SetupChoicesModal from '../SetupChoicesModal/SetupChoicesModal';

const GameEditor = ({ 
  classNames, 
  gameEditor: { isSetupChoicesModalOpen, isSelectBackgroundColorOpen, classIdEditingName, liveEditingCategory, isGameMetadataModalOpen }, 
  gameViewEditor: { isSectionEditorOpen, isSnapshotTakerOpen }, 
  gameContext: { isConstellationOpen, isConstellationClosing, constellationZoomImageFile }, 
  gameFormEditor: { isCreateCutsceneOpen, isCutscenesMenuOpen, isCreateRelationOpen, isRelationsMenuOpen, isWorldRelationOpen },
  leftColumnRef, 
  rightColumnRef, 
  leftColumn, 
  rightColumn, 
  children, 
  changeGameState, 
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor,
}) => {
  useEffect(() => {
    const ogStyle = document.documentElement.style
    document.documentElement.style="font-size: 2vh";
    changeGameState(EDIT_STATE)
    return () => {
      clearEditor()
      clearGameFormEditor()
      clearGameViewEditor()
      document.documentElement.style= ogStyle
    }
  }, [])

  return <>
    {isConstellationOpen && <Constellation className="Constellation--overlay" zoomOut zoomIn={isConstellationClosing} zoomOutImage={constellationZoomImageFile} />}
    <div className={"GameEditor " + classNames}>
      <div id="GameEditor__left-column" ref={leftColumnRef} className="GameEditor__left-column">
        {!isSectionEditorOpen && leftColumn}
      </div>
      {children}
      <div className="GameEditor__overlay">
        {isSectionEditorOpen && <SectionEditor/>}
        {isSnapshotTakerOpen && <SnapshotTaker/>}
      </div>
      <div id="GameEditor__right-column" ref={rightColumnRef} className="GameEditor__right-column">
        {!isSectionEditorOpen && rightColumn}
      </div>
      {liveEditingCategory && <LiveEditor/>}
      {isGameMetadataModalOpen && <GameMetadataModal/>}
      {classIdEditingName && <ClassNameModal/>}
      {isCutscenesMenuOpen && <CutscenesMenu/>}
      {isCreateCutsceneOpen && <CreateCutscene/>}
      {isRelationsMenuOpen && <RelationsMenu/>}
      {isCreateRelationOpen && <CreateRelation/>}
      {isWorldRelationOpen && <WorldRelation/>}
      {isSetupChoicesModalOpen && <SetupChoicesModal/>}
      {isSelectBackgroundColorOpen && <SelectBackgroundColor/>}
    </div>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameEditor: state.gameEditor,
  gameViewEditor: state.gameViewEditor,
  gameFormEditor: state.gameFormEditor,
  gameContext: state.gameContext,
})

export default connect(mapStateToProps, { 
  clearEditor, 
  clearGameFormEditor, 
  clearGameViewEditor, 
  changeGameState
})(GameEditor);