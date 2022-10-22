import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import LiveEditor from '../LiveEditor/LiveEditor';
import { clearEditor } from '../../store/actions/gameEditorActions';
import { clearGameFormEditor } from '../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { clearGameViewEditor } from '../../store/actions/gameViewEditorActions';
import SectionEditor from '../SectionEditor/SectionEditor';
import SnapshotTaker from '../SnapshotTaker/SnapshotTaker';
import SelectBackgroundColor from '../SelectBackgroundColor/SelectBackgroundColor';
import { Constellation } from '../../app/Constellation/Constellation';
import { EDIT_STATE } from '../../constants';
import { changeGameState } from '../../store/actions/gameContextActions';
import GameMetadataModal from '../GameMetadataModal/GameMetadataModal';
import CutscenesMenu from '../CutscenesMenu/CutscenesMenu';
import CreateCutscene from '../CreateCutscene/CreateCutscene';
import CreateRelation from '../CreateRelation/CreateRelation';
import RelationsMenu from '../RelationsMenu/RelationsMenu';
import WorldRelation from '../WorldRelation/WorldRelation';

const GameEditor = ({ 
  classNames, 
  gameEditor: { isSelectBackgroundColorOpen, liveEditingCategory, isGameMetadataModalOpen }, 
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
  clearGameViewEditor
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

  return (
    <div className={"GameEditor " + classNames}>
      <div id="GameEditor__left-column" ref={leftColumnRef} className="GameEditor__left-column">
        {leftColumn}
      </div>
      {children}
      <div className="GameEditor__overlay">
        {isSectionEditorOpen && <SectionEditor/>}
        {isSnapshotTakerOpen && <SnapshotTaker/>}
      </div>
      <div id="GameEditor__right-column" ref={rightColumnRef} className="GameEditor__right-column">
        {rightColumn}
      </div>
      {isConstellationOpen && <Constellation zoomOut zoomIn={isConstellationClosing} zoomOutImage={constellationZoomImageFile} />}
      {liveEditingCategory && <LiveEditor/>}
      {isSelectBackgroundColorOpen && <SelectBackgroundColor/>}
      {isGameMetadataModalOpen && <GameMetadataModal/>}
      {isCutscenesMenuOpen && <CutscenesMenu/>}
      {isCreateCutsceneOpen && <CreateCutscene/>}
      {isRelationsMenuOpen && <RelationsMenu/>}
      {isCreateRelationOpen && <CreateRelation/>}
      {isWorldRelationOpen && <WorldRelation/>}
    </div>
  );
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