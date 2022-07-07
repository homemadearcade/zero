import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import { Button } from '@mui/material';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';

const LiveEditor = ({ closeLiveEditor, editor: { editorState: { classSelectedIdLiveEditor } }}) => {
  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><i className="fas fa-close"/></Button></div>
      <PhysicsEditor classId={classSelectedIdLiveEditor}/>
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
