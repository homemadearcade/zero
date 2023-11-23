import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { closeLiveEditor, openLiveEditor } from '../../../store/actions/game/gameSelectorActions';

import './SideEditor.scss'
import Button from '../../../ui/Button/Button';
import CollisionsEditor from '../CollisionsEditor/CollisionsEditor';
import GravityEditor from '../GravityEditor/GravityEditor';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import CameraEditor from '../CameraEditor/CameraEditor';
import ProjectileEditor from '../ProjectileEditor/ProjectileEditor';
import MovementEditor from '../MovementEditor/MovementEditor';
import EntityBehaviorTitle from '../../entityModel/EntityBehaviorTitle/EntityBehaviorTitle';
import MenuIconButton from '../../../ui/MenuIconButton/MenuIconButton';
import { MenuItem } from '@mui/material';
import { CAMERA_EDITOR_IID, PLAYER_ENTITY_IID, JUMP_EDITOR_IID, MOVEMENT_EDITOR_IID, COLLISION_EDITOR_IID, PROJECTILE_EDITOR_IID, STAGE_EDITOR_IID } from '../../constants';
import JumpEditor from '../JumpEditor/JumpEditor';

const SideEditor = ({ closeLiveEditor, openLiveEditor, gameSelector: { entityModelIdSelectedLiveEditor, liveEditingCategory }, gameModel: { gameModel } }) => {
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

  if(!title) return null

  return (
    <div className="SideEditor">
      {<div className="SideEditor__close"><Button onClick={closeLiveEditor}><Icon icon="faClose"/></Button></div>}
      {<EntityBehaviorTitle entityModelId={entityModelIdSelectedLiveEditor} title={<>
          <span className="SideEditor__title">{title}</span>
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
                entityModel.entityClassIID === PLAYER_ENTITY_IID && <MenuItem key="Camera" onClick={() => {
                  openLiveEditor(CAMERA_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Camera</MenuItem>,
                entityModel.entityClassIID === PLAYER_ENTITY_IID && <MenuItem key="Jump" onClick={() => {
                  openLiveEditor(JUMP_EDITOR_IID, entityModelIdSelectedLiveEditor)
                  closeMenu()
                }}>Jump</MenuItem>,
              ]
            }}
          />
      </>} 
    />}
      {liveEditingCategory === JUMP_EDITOR_IID && <JumpEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === MOVEMENT_EDITOR_IID && <MovementEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === PROJECTILE_EDITOR_IID && <ProjectileEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === COLLISION_EDITOR_IID && <CollisionsEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
      {liveEditingCategory === STAGE_EDITOR_IID && <GravityEditor/>}
      {liveEditingCategory === CAMERA_EDITOR_IID && <CameraEditor entityModelId={entityModelIdSelectedLiveEditor}/>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default connect(mapStateToProps, { editGameModel, closeLiveEditor, openLiveEditor })(SideEditor);
