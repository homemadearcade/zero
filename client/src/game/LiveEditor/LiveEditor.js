import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import Button from '../../app/ui/Button/Button';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';
import WorldEditor from '../WorldEditor/WorldEditor';
import { getRemoteCobrowsingState } from '../../utils/cobrowsing';

const LiveEditor = ({ closeLiveEditor, editorState: { classSelectedIdLiveEditor, liveEditingCategory } }) => {
  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><i className="fas fa-close"/></Button></div>
      {liveEditingCategory === "physics" && <PhysicsEditor classId={classSelectedIdLiveEditor}/>}
      {liveEditingCategory === "world" && <WorldEditor/>}
    </div>
  );
};

const mapStateToProps = (state) => getRemoteCobrowsingState(state, {
  game: state.game,
  editorState: state.editor.editorState,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
