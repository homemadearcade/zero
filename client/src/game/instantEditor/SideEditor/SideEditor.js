import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { closeLiveEditor, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';

import './SideEditor.scss'
import Button from '../../../ui/Button/Button';
import PhysicsEditor from '../PhysicsEditor/PhysicsEditor';
import GravityEditor from '../GravityEditor/GravityEditor';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import CameraEditor from '../CameraEditor/CameraEditor';
import ProjectileEditor from '../ProjectileEditor/ProjectileEditor';
import MovementEditor from '../MovementEditor/MovementEditor';
import EntityMemberTitle from '../../entityModel/EntityMemberTitle/EntityMemberTitle';
import MenuIconButton from '../../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import { CAMERA_EDITOR, PLAYER_ENTITY_IID, JUMP_EDITOR, MOVEMENT_EDITOR, PHYSICS_EDITOR, PROJECTILE_EDITOR, STAGE_EDITOR } from '../../constants';
import JumpEditor from '../JumpEditor/JumpEditor';

const SideEditor = ({ closeLiveEditor, openLiveEditor, gameSelector: { entityModelIdSelectedLiveEditor, liveEditingCategory }, gameModel: { gameModel } }) => {
  const entityModel = gameModel.entityModels[entityModelIdSelectedLiveEditor]

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

  if(!title) return null

  return (
    <div className="SideEditor">
      {<div className="SideEditor__close"><Button onClick={closeLiveEditor}><Icon icon="faClose"/></Button></div>}
      {<EntityMemberTitle entityModelId={entityModelIdSelectedLiveEditor} title={<>
          <span className="SideEditor__title">{title}</span>
          <MenuIconButton
            icon={<Icon size="xs" icon={"faChevronDown"} />} 
            menu={(closeMenu) => {
              return [
                <MenuItem key="Movement" onClick={() => {
                  openLiveEditor(MOVEMENT_EDITOR, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Movement</MenuItem>,
                <MenuItem key="Collisions" onClick={() => {
                  openLiveEditor(PHYSICS_EDITOR, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Collisions</MenuItem>,
                <MenuItem key="Projectile" onClick={() => {
                  openLiveEditor(PROJECTILE_EDITOR, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Projectile</MenuItem>,
                entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <MenuItem key="Camera" onClick={() => {
                  openLiveEditor(CAMERA_EDITOR, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Camera</MenuItem>,
                entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <MenuItem key="Jump" onClick={() => {
                  openLiveEditor(JUMP_EDITOR, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Jump</MenuItem>,
              ]
            }}
          />
      </>} 
    />}
      {liveEditingCategory === JUMP_EDITOR && <JumpEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === MOVEMENT_EDITOR && <MovementEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === PROJECTILE_EDITOR && <ProjectileEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === PHYSICS_EDITOR && <PhysicsEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === STAGE_EDITOR && <GravityEditor/>}
      {liveEditingCategory === CAMERA_EDITOR && <CameraEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor, openLiveEditor })(SideEditor);
