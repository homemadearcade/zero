import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import Button from '../../app/ui/Button/Button';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';
import WorldEditor from '../WorldEditor/WorldEditor';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LiveEditor = ({ closeLiveEditor, editor: { classSelectedIdLiveEditor, liveEditingCategory } }) => {
  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><FontAwesomeIcon icon={faClose}/></Button></div>
      {liveEditingCategory === "physics" && <PhysicsEditor classId={classSelectedIdLiveEditor}/>}
      {liveEditingCategory === "world" && <WorldEditor/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
