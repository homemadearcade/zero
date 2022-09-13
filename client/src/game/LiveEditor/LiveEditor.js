import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import Button from '../../app/ui/Button/Button';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';
import WorldEditor from '../WorldEditor/WorldEditor';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Icon from '../../app/ui/Icon/Icon';
import CameraEditor from '../CameraEditor/CameraEditor';
import ProjectileEditor from '../ProjectileEditor/ProjectileEditor';
import MovementEditor from '../MovementEditor/MovementEditor';

const LiveEditor = ({ closeLiveEditor, editor: { classIdSelectedLiveEditor, liveEditingCategory } }) => {
  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><Icon icon="faClose"/></Button></div>
      {liveEditingCategory === "movement" && <MovementEditor classId={classIdSelectedLiveEditor}/>}
      {liveEditingCategory === "projectile" && <ProjectileEditor classId={classIdSelectedLiveEditor}/>}
      {liveEditingCategory === "physics" && <PhysicsEditor classId={classIdSelectedLiveEditor}/>}
      {liveEditingCategory === "world" && <WorldEditor/>}
      {liveEditingCategory === "camera" && <CameraEditor classId={classIdSelectedLiveEditor}/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
