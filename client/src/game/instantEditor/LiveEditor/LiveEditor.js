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
import EntityMemberTitle from '../../entityModel/EntityMemberTitle/EntityMemberTitle';
import MenuIconButton from '../../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import JumpEditor from '../JumpEditor/JumpEditor';
import { PLAYER_ENTITY_IID, CAMERA_EDITOR_IID, JUMP_EDITOR_IID, MOVEMENT_EDITOR_IID, COLLISION_EDITOR_IID, PROJECTILE_EDITOR_IID, STAGE_EDITOR_IID } from '../../../constants/interfaceIds';

const LiveEditor = ({ closeLiveEditor, openLiveEditor, gameSelector: { entityModelIdSelectedLiveEditor, liveEditingCategory }, gameModel: { gameModel } }) => {
  const entityModel = gameModel.entityModels[entityModelIdSelectedLiveEditor]

  let title = null

  if(liveEditingCategory === MOVEMENT_EDITOR_IID) {
    title = 'Movement'
  } else if(liveEditingCategory === COLLISION_EDITOR_IID) {
    title = 'Collisions'
  } else if(liveEditingCategory === PROJECTILE_EDITOR_IID) {
    title = 'Projectile'
  } else if(liveEditingCategory === CAMERA_EDITOR_IID) {
    title = 'Camera'
  } else if(liveEditingCategory === JUMP_EDITOR_IID) {
    title = 'Jump'
  }

  return (
    <div className="LiveEditor">
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><Icon icon="faClose"/></Button></div>
      {title && <EntityMemberTitle entityModelId={entityModelIdSelectedLiveEditor} title={<>
          <span className="LiveEditor__title">{title}</span>
          <MenuIconButton
            icon={<Icon size="xs" icon={"faChevronDown"} />} 
            menu={(closeMenu) => {
              return [
                <MenuItem key="Movement" onClick={() => {
                  openLiveEditor(MOVEMENT_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Movement</MenuItem>,
                <MenuItem key="Collisions" onClick={() => {
                  openLiveEditor(COLLISION_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Collisions</MenuItem>,
                <MenuItem key="Projectile" onClick={() => {
                  openLiveEditor(PROJECTILE_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Projectile</MenuItem>,
                entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <MenuItem key="Camera" onClick={() => {
                  openLiveEditor(CAMERA_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Camera</MenuItem>,
                entityModel.entityInterfaceId === PLAYER_ENTITY_IID && <MenuItem key="Jump" onClick={() => {
                  openLiveEditor(JUMP_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Jump</MenuItem>,
              ]
            }}
          />
      </>} />}
      {liveEditingCategory === JUMP_EDITOR_IID && <JumpEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === MOVEMENT_EDITOR_IID && <MovementEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === PROJECTILE_EDITOR_IID && <ProjectileEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === COLLISION_EDITOR_IID && <PhysicsEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === STAGE_EDITOR_IID && <GravityEditor/>}
      {liveEditingCategory === CAMERA_EDITOR_IID && <CameraEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor, openLiveEditor })(LiveEditor);
