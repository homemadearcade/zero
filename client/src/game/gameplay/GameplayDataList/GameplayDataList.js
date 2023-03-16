/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameplayDataList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { openCreateClassFlow, openCreateCutscene, openCreateEffect, openCreateEvent, openCreateRelation, openCreateTag } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import {  DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, EFFECT_ADD_IID, EFFECT_CONTAINER_IID, EFFECT_SELECT_IID, EVENT_ADD_IID, EVENT_CONTAINER_IID, EVENT_SELECT_IID, TAG_ADD_IID, TAG_CONTAINER_IID, TAG_SELECT_IID } from '../../../constants/interfaceIds';
import { openClassBoxModal } from '../../../store/actions/gameSelectorActions';
import { NestedListContainer, NestedListItem, NestedListItemButton } from '../../../ui/NestedList/NestedList';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';

const DATA_MAX = 16

const GameplayDataList = ({
  gameModel: { gameModel },
  openCreateTag,
  openCreateCutscene,
  openCreateEffect,
  openCreateEvent,
  openCreateRelation
}) => {
  const cutscenes = gameModel?.cutscenes

  if(!cutscenes) {
    return null
  }

  const nestedLists = []

  const dialogueScenes = Object.keys(gameModel.cutscenes).filter((currentCutsceneId) => {
    const currentCutscene = cutscenes[currentCutsceneId]
    if(currentCutscene.isRemoved) return false
    if(currentCutscene.inDialogueMenu) return true
    return false
  }).map((currentCutsceneId, i) => {
    const currentCutscene = cutscenes[currentCutsceneId]
    return <Unlockable interfaceId={DIALOGUE_SELECT_IID}>
      <NestedListItem title={currentCutscene.name} onClick={() => {openCreateCutscene(currentCutscene)}}/>
    </Unlockable>
  })

  dialogueScenes.push(<Unlockable interfaceId={DIALOGUE_ADD_IID}>
    <NestedListItemButton>
      <Button onClick={() => {
        openCreateCutscene({
          inDialogueMenu: true
        })
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: DIALOGUE_CONTAINER_IID,
    title: 'Dialogues',
    id: 'Dialogues',
    children: dialogueScenes
  })

  const tags = Object.keys(gameModel.tags).filter((currentTagId) => {
    const currentTag = gameModel.tags[currentTagId]
    if(currentTag.isRemoved) return false
    if(currentTag.isAutomaticTag) return false
    return true
  }).map((currentTagId, i) => {
    const currentTag = gameModel.tags[currentTagId]
    return <Unlockable interfaceId={TAG_SELECT_IID}>
      <NestedListItem useColor color={currentTag.color} title={currentTag.name} 
        onClick={() => {openCreateTag(currentTag)}}
      >
      </NestedListItem>
    </Unlockable>
  })

  tags.push(<Unlockable interfaceId={TAG_ADD_IID}>
    <NestedListItemButton
      >
      <Button onClick={() => {
        openCreateTag()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: TAG_CONTAINER_IID,
    title: 'Tags',
    id: 'Tags',
    children: tags
  })

  const events = Object.keys(gameModel.events).filter((currentEventId) => {
    const currentEvent = gameModel.events[currentEventId]
    if(currentEvent.isRemoved) return false
    return true
  }).map((currentEventId, i) => {
    const currentEvent = gameModel.events[currentEventId]
    return <Unlockable interfaceId={EVENT_SELECT_IID}>
      <NestedListItem title={currentEvent.eventId} 
        onClick={() => {openCreateEvent(currentEvent)}}
      >
      </NestedListItem>
    </Unlockable>
  })

  events.push(<Unlockable interfaceId={EVENT_ADD_IID}>
    <NestedListItemButton>
      <Button onClick={() => {
        openCreateEvent()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  // nestedLists.push({
  //   interfaceId: EVENT_CONTAINER_IID,
  //   title: 'Events',
  //   id: 'Events',
  //   children: events
  // })

  const effects = Object.keys(gameModel.effects).filter((currentEffectId) => {
    const currentEffect = gameModel.effects[currentEffectId]
    if(currentEffect.isRemoved) return false
    return true
  }).map((currentEffectId, i) => {
    const currentEffect = gameModel.effects[currentEffectId]
    return <Unlockable interfaceId={EFFECT_SELECT_IID}>
      <NestedListItem title={currentEffect.effectId} 
        onClick={() => {openCreateEffect(currentEffect)}}
      >
      </NestedListItem>
    </Unlockable>
  })

  effects.push(<Unlockable interfaceId={EFFECT_ADD_IID}>
    <NestedListItemButton
      >
      <Button onClick={() => {
        openCreateEffect()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  // nestedLists.push({
  //   interfaceId: EFFECT_CONTAINER_IID,
  //   title: 'Effects',
  //   id: 'Effects',
  //   children: effects
  // })

  const relations = Object.keys(gameModel.relations).filter((currentRelationId) => {
    const currentRelation = gameModel.relations[currentRelationId]
    if(currentRelation.isRemoved) return false
    return true
  }).map((currentRelationId, i) => {
    const currentRelation = gameModel.relations[currentRelationId]
    return <Unlockable interfaceId={EFFECT_SELECT_IID}>
      <NestedListItem title={currentRelation.relationId} 
        onClick={() => {openCreateRelation(currentRelation)}}
      >
      </NestedListItem>
    </Unlockable>
  })

  relations.push(<Unlockable interfaceId={EFFECT_ADD_IID}>
    <NestedListItemButton
      >
      <Button onClick={() => {
        openCreateRelation()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: EFFECT_CONTAINER_IID,
    title: 'Relationships',
    id: 'Relationships',
    children: relations
  })

  return <div className="GameplayDataList">
    <NestedListContainer>
      {nestedLists.map((props) => {
        return <CobrowsingNestedList
          listId="LeftColumn"
          {...props}
        ></CobrowsingNestedList>
      })}
    </NestedListContainer>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { editGameModel, openCreateClassFlow, openCreateEvent, openCreateEffect, openCreateTag, openCreateCutscene, openCreateRelation, openClassBoxModal }),
)(GameplayDataList);
