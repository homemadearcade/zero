import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { closeLiveEditor, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';

import './LiveEditor.scss'
import Button from '../../../ui/Button/Button';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';
import GravityEditor from '../GravityEditor/GravityEditor';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import CameraEditor from '../CameraEditor/CameraEditor';
import ProjectileEditor from '../ProjectileEditor/ProjectileEditor';
import MovementEditor from '../MovementEditor/MovementEditor';
import ClassMemberTitle from '../../entityClass/ClassMemberTitle/ClassMemberTitle';
import MenuIconButton from '../../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import { CAMERA_EDITOR, PLAYER_CLASS, JUMP_EDITOR, MOVEMENT_EDITOR, PHYSICS_EDITOR, PROJECTILE_EDITOR, STAGE_EDITOR } from '../../constants';
import JumpEditor from '../JumpEditor/JumpEditor';

const LiveEditor = ({ closeLiveEditor, openLiveEditor, gameSelector: { entityClassIdSelectedLiveEditor, liveEditingCategory }, gameModel: { gameModel } }) => {
  const entityClass = gameModel.entityClasses[entityClassIdSelectedLiveEditor]

  let title = null

  if(liveEditingCategory === MOVEMENT_EDITOR) {
    title = 'Movement'
  } else if(liveEditingCategory === PHYSICS_EDITOR) {
    title = 'Collisions'
  } else if(liveEditingCategory === PROJECTILE_EDITOR) {
    title = 'Projectile'
  } else if(liveEditingCategory === CAMERA_EDITOR) {
    title = 'Camera'
  } else if(liveEditingCategory === JUMP_EDITOR) {
    title = 'Jump'
  }

  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><Icon icon="faClose"/></Button></div>
      {title && <ClassMemberTitle entityClassId={entityClassIdSelectedLiveEditor} title={<>
          <span className="LiveEditor__title">{title}</span>
          <MenuIconButton
            icon={<Icon size="xs" icon={"faChevronDown"} />} 
            menu={(closeMenu) => {
              return [
                <MenuItem key="Movement" onClick={() => {
                  openLiveEditor(MOVEMENT_EDITOR, entityClassIdSelectedLiveEditor)
                  closeMenu()
                }}>Movement</MenuItem>,
                <MenuItem key="Collisions" onClick={() => {
                  openLiveEditor(PHYSICS_EDITOR, entityClassIdSelectedLiveEditor)
                  closeMenu()
                }}>Collisions</MenuItem>,
                <MenuItem key="Projectile" onClick={() => {
                  openLiveEditor(PROJECTILE_EDITOR, entityClassIdSelectedLiveEditor)
                  closeMenu()
                }}>Projectile</MenuItem>,
                entityClass.classInterfaceCategory === PLAYER_CLASS && <MenuItem key="Camera" onClick={() => {
                  openLiveEditor(CAMERA_EDITOR, entityClassIdSelectedLiveEditor)
                  closeMenu()
                }}>Camera</MenuItem>,
                entityClass.classInterfaceCategory === PLAYER_CLASS && <MenuItem key="Jump" onClick={() => {
                  openLiveEditor(JUMP_EDITOR, entityClassIdSelectedLiveEditor)
                  closeMenu()
                }}>Jump</MenuItem>,
              ]
            }}
          />
      </>} />}
      {liveEditingCategory === JUMP_EDITOR && <JumpEditor entityClassId={entityClassIdSelectedLiveEditor}/>}
      {liveEditingCategory === MOVEMENT_EDITOR && <MovementEditor entityClassId={entityClassIdSelectedLiveEditor}/>}
      {liveEditingCategory === PROJECTILE_EDITOR && <ProjectileEditor entityClassId={entityClassIdSelectedLiveEditor}/>}
      {liveEditingCategory === PHYSICS_EDITOR && <PhysicsEditor entityClassId={entityClassIdSelectedLiveEditor}/>}
      {liveEditingCategory === STAGE_EDITOR && <GravityEditor/>}
      {liveEditingCategory === CAMERA_EDITOR && <CameraEditor entityClassId={entityClassIdSelectedLiveEditor}/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor, openLiveEditor })(LiveEditor);
