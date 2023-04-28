import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { closeEntityBehaviorLiveEditor } from '../../../store/actions/game/gameSelectorActions';

import './EntityBehaviorLiveEditor.scss'
import Button from '../../../ui/Button/Button';
import CollisionsEditor from '../CollisionsEditor/CollisionsEditor';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Icon from '../../../ui/Icon/Icon';
import CameraEditor from '../CameraEditor/CameraEditor';
import ProjectileEditor from '../ProjectileEditor/ProjectileEditor';
import MovementEditor from '../MovementEditor/MovementEditor';
import EntityMemberTitle from '../../entityModel/EntityMemberTitle/EntityMemberTitle';
import JumpEditor from '../JumpEditor/JumpEditor';
import { PLAYER_ENTITY_IID, LIVE_ENTITY_EDITOR_TAB_CONTANER_IID, LIVE_ENTITY_EDITOR_JUMP_TAB_IID, LIVE_ENTITY_EDITOR_MOVEMENT_TAB_IID, LIVE_ENTITY_EDITOR_PROJECTILE_TAB_IID, LIVE_ENTITY_EDITOR_COLLISIONS_TAB_IID, LIVE_ENTITY_EDITOR_CAMERA_TAB_IID } from '../../../constants/interfaceIds';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';

const EntityBehaviorLiveEditor = ({ closeEntityBehaviorLiveEditor, gameSelector: { entityModelIdSelectedLiveEditor, isEntityBehaviorLiveEditorOpen }, gameModel: { gameModel } }) => {
  const entityModel = gameModel.entityModels[entityModelIdSelectedLiveEditor]

  const jumpTab = {
    label: 'Jump',
    interfaceId: LIVE_ENTITY_EDITOR_JUMP_TAB_IID,
    body: <JumpEditor entityModelId={entityModelIdSelectedLiveEditor}/>
  }

  const movementTab = {
    label: 'Movement',
    interfaceId: LIVE_ENTITY_EDITOR_MOVEMENT_TAB_IID,
    body: <MovementEditor entityModelId={entityModelIdSelectedLiveEditor}/>
  }

  const projectileTab = {
    label: 'Projectile',
    interfaceId: LIVE_ENTITY_EDITOR_PROJECTILE_TAB_IID,
    body: <ProjectileEditor entityModelId={entityModelIdSelectedLiveEditor}/>
  }

  const collisionTab = {
    label: 'Collisions',
    interfaceId: LIVE_ENTITY_EDITOR_COLLISIONS_TAB_IID,
    body: <CollisionsEditor entityModelId={entityModelIdSelectedLiveEditor}/>
  }

  const tabs = [movementTab, projectileTab, collisionTab, jumpTab]

  const cameraTab = {
    label: 'Camera',
    interfaceId: LIVE_ENTITY_EDITOR_CAMERA_TAB_IID,
    body: <CameraEditor entityModelId={entityModelIdSelectedLiveEditor}/>
  }

  if(entityModel.entityIID === PLAYER_ENTITY_IID) {

    tabs.push(cameraTab)

  }

  return (
    <div className="EntityBehaviorLiveEditor">
      <div className="EntityBehaviorLiveEditor__close"><Button onClick={closeEntityBehaviorLiveEditor}><Icon icon="faClose"/></Button></div>
      <EntityMemberTitle title="Behavior" entityModelId={entityModelIdSelectedLiveEditor}></EntityMemberTitle>
      <CobrowsingTabs tabs={tabs} interfaceGroupId={LIVE_ENTITY_EDITOR_TAB_CONTANER_IID} />
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
})

export default connect(mapStateToProps, { editGameModel, closeEntityBehaviorLiveEditor })(EntityBehaviorLiveEditor);
