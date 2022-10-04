import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import LiveEditor from '../LiveEditor/LiveEditor';
import { clearEditor } from '../../store/actions/editorActions';
import { clearEditorForms } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { clearEditorInstance } from '../../store/actions/editorInstanceActions';
import SectionEditor from '../SectionEditor/SectionEditor';
import SnapshotTaker from '../SnapshotTaker/SnapshotTaker';
import SelectBackgroundColor from '../SelectBackgroundColor/SelectBackgroundColor';
import { Constellation } from '../../app/Constellation/Constellation';

const GameEditor = ({ classNames, editor: { isSelectBackgroundColorOpen, isLiveEditorOpen, isSectionEditorOpen, isSnapshotTakerOpen }, homemadeArcade: { isConstellationOpen, isConstellationClosing, constellationZoomImageFile }, leftColumnRef, rightColumnRef, leftColumn, rightColumn, children, clearEditor, clearEditorForms, clearEditorInstance}) => {
  useEffect(() => {
    const ogStyle = document.documentElement.style
    document.documentElement.style="font-size: 2vh";
    return () => {
      clearEditor()
      clearEditorForms()
      clearEditorInstance()
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
      {isLiveEditorOpen && <LiveEditor/>}
      {isSelectBackgroundColorOpen && <SelectBackgroundColor/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
  homemadeArcade: state.homemadeArcade
})

export default connect(mapStateToProps, { clearEditor, clearEditorForms, clearEditorInstance })(GameEditor);