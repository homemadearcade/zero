import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import './GameEditor.scss';

import ContextMenu from '../../app/ui/ContextMenu/ContextMenu';

import LiveEditor from '../LiveEditor/LiveEditor';
import { clearEditor } from '../../store/actions/editorActions';
import { clearEditorForms } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { clearEditorInstance } from '../../store/actions/editorInstanceActions';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';

const GameEditor = ({ editor: { isLiveEditorOpen }, editorForms: { isCreateColorFlowOpen}, leftColumnRef, rightColumnRef, leftColumn, rightColumn, children, clearEditor, clearEditorForms, clearEditorInstance}) => {
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
    <div className="GameEditor">
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
  editorForms: state.editorForms
})

export default connect(mapStateToProps, { clearEditor, clearEditorForms, clearEditorInstance })(GameEditor);