import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor, openLiveCameraEditor, openLiveMovementEditor, openLivePhysicsEditor, openLiveProjectileEditor } from '../../store/actions/editorActions';

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
import { HERO_CLASS } from '../../constants';

const LiveEditor = ({ closeLiveEditor, openLiveMovementEditor, openLivePhysicsEditor, openLiveProjectileEditor, openLiveCameraEditor, editor: { classIdSelectedLiveEditor, liveEditingCategory }, game: { gameModel } }) => {
  const objectClass = gameModel.classes[classIdSelectedLiveEditor]

  let title = null

  if(liveEditingCategory === "movement") {
    title = 'Movement'
  } else if(liveEditingCategory === "physics") {
    title = 'Physics'
  } else if(liveEditingCategory === "projectile") {
    title = 'Projectile'
  } else if(liveEditingCategory === "camera") {
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
              return <>
                <MenuItem onClick={() => {
                  openLiveMovementEditor(classIdSelectedLiveEditor)
                  closeMenu()
                }}>Movement</MenuItem>
                <MenuItem onClick={() => {
                  openLivePhysicsEditor(classIdSelectedLiveEditor)
                  closeMenu()
                }}>Physics</MenuItem>
                {objectClass.type === HERO_CLASS && <MenuItem onClick={() => {
                  openLiveProjectileEditor(classIdSelectedLiveEditor)
                  closeMenu()
                }}>Projectile</MenuItem>}
                {objectClass.type === HERO_CLASS && <MenuItem onClick={() => {
                  openLiveCameraEditor(classIdSelectedLiveEditor)
                  closeMenu()
                }}>Camera</MenuItem>}
              </>
            }}
          />
      </>} />}
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

export default connect(mapStateToProps, { editGameModel, closeLiveEditor, openLiveMovementEditor, openLivePhysicsEditor, openLiveProjectileEditor, openLiveCameraEditor })(LiveEditor);
