import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor, openLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import Button from '../../app/ui/Button/Button';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';
import WorldEditor from '../WorldEditor/WorldEditor';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Icon from '../../app/ui/Icon/Icon';
import CameraEditor from '../CameraEditor/CameraEditor';
import ProjectileEditor from '../ProjectileEditor/ProjectileEditor';
import MovementEditor from '../MovementEditor/MovementEditor';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import MenuIconButton from '../../app/ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import { CAMERA_EDITOR, HERO_CLASS, MOVEMENT_EDITOR, PHYSICS_EDITOR, PROJECTILE_EDITOR, WORLD_EDITOR } from '../../constants';

const LiveEditor = ({ closeLiveEditor, openLiveEditor, editor: { classIdSelectedLiveEditor, liveEditingCategory }, game: { gameModel } }) => {
  const objectClass = gameModel.classes[classIdSelectedLiveEditor]

  let title = null

  if(liveEditingCategory === MOVEMENT_EDITOR) {
    title = 'Movement'
  } else if(liveEditingCategory === PHYSICS_EDITOR) {
    title = 'Collisions'
  } else if(liveEditingCategory === PROJECTILE_EDITOR) {
    title = 'Projectile'
  } else if(liveEditingCategory === CAMERA_EDITOR) {
    title = 'Camera'
  }

  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><Icon icon="faClose"/></Button></div>
      {title && <ClassMemberTitle classId={classIdSelectedLiveEditor} title={<>
          <span className="LiveEditor__title">{title}</span>
          <MenuIconButton
            icon={<Icon size="xs" icon={"faChevronDown"} />} 
            menu={(closeMenu) => {
              return [
                <MenuItem key="Movement" onClick={() => {
                  openLiveEditor(MOVEMENT_EDITOR, classIdSelectedLiveEditor)
                  closeMenu()
                }}>Movement</MenuItem>,
                <MenuItem key="Collisions" onClick={() => {
                  openLiveEditor(PHYSICS_EDITOR, classIdSelectedLiveEditor)
                  closeMenu()
                }}>Collisions</MenuItem>,
                objectClass.type === HERO_CLASS && <MenuItem key="Projectile" onClick={() => {
                  openLiveEditor(PROJECTILE_EDITOR, classIdSelectedLiveEditor)
                  closeMenu()
                }}>Projectile</MenuItem>,
                objectClass.type === HERO_CLASS && <MenuItem key="Camera" onClick={() => {
                  openLiveEditor(CAMERA_EDITOR, classIdSelectedLiveEditor)
                  closeMenu()
                }}>Camera</MenuItem>,
              ]
            }}
          />
      </>} />}
      {liveEditingCategory === MOVEMENT_EDITOR && <MovementEditor classId={classIdSelectedLiveEditor}/>}
      {liveEditingCategory === PROJECTILE_EDITOR && <ProjectileEditor classId={classIdSelectedLiveEditor}/>}
      {liveEditingCategory === PHYSICS_EDITOR && <PhysicsEditor classId={classIdSelectedLiveEditor}/>}
      {liveEditingCategory === WORLD_EDITOR && <WorldEditor/>}
      {liveEditingCategory === CAMERA_EDITOR && <CameraEditor classId={classIdSelectedLiveEditor}/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor, openLiveEditor })(LiveEditor);
