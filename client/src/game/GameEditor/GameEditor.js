import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import ContextMenu from '../../app/ui/ContextMenu/ContextMenu';

import LiveEditor from '../LiveEditor/LiveEditor';
import { clearEditor } from '../../store/actions/editorActions';
import { clearEditorForms } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import { clearEditorInstance } from '../../store/actions/editorInstanceActions';

const GameEditor = ({editor: { isLiveEditorOpen }, leftColumnRef, rightColumnRef, leftColumn, rightColumn, children, clearEditor, clearEditorForms, clearEditorInstance}) => {
  useEffect(() => {
    return () => {
      clearEditor()
      clearEditorForms()
      clearEditorInstance()
    }
  }, [])

  return (
    <div className="GameEditor">
      <ContextMenu/>
      <div id="GameEditor__left-column" ref={leftColumnRef} className="GameEditor__left-column">
        {leftColumn}
      </div>
      {children}
      <div id="GameEditor__right-column" ref={rightColumnRef} className="GameEditor__right-column">
        {rightColumn}
      </div>
      {isLiveEditorOpen && <LiveEditor/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  editor: state.editor,
})

export default connect(mapStateToProps, { clearEditor, clearEditorForms, clearEditorInstance })(GameEditor);