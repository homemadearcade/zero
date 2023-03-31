/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectorAbstractList.scss';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { openEditEntityGraphics, openCreateCutscene, openCreateEffect, openCreateEvent, openCreateRelation, openCreateRelationTag } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import {  DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, EFFECT_ADD_IID, EFFECT_CONTAINER_IID, EVENT_ADD_IID, EVENT_CONTAINER_IID, EVENT_SELECT_IID, RELATION_ADD_IID, RELATION_CONTAINER_IID, RELATION_TAG_ADD_IID, RELATION_TAG_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import { NestedListContainer, NestedListItem, NestedListItemButton } from '../../../ui/NestedList/NestedList';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import RelationItem from '../../relations/RelationItem/RelationItem';
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from '../../../constants/interfaceIds/cutsceneInterfaceIds';
import EventShorthand from '../../event/EventShorthand/EventShorthand';
import RelationTagItem from '../../tags/RelationTagItem/RelationTagItem';
import EffectItem from '../../effect/EffectItem/EffectItem';
import SelectorMoreMenu from '../SelectorMoreMenu/SelectorMoreMenu';
import { EFFECT_ABSTRACT_CLASS, EVENT_ABSTRACT_CLASS, IS_DATA_REMOVED, RELATION_ABSTRACT_CLASS, RELATION_TAG_ABSTRACT_CLASS } from '../../constants';

const DATA_MAX = 16

const SelectorAbstractList = ({
  gameModel: { gameModel },
  openCreateRelationTag,
  openCreateCutscene,
  openCreateEffect,
  openCreateEvent,
  openCreateRelation,
  gameSelector: { selectorClassInvisibility },
}) => {
  if(!gameModel.cutscenes) {
    return null
  }

  function isDataSourceInvisible(selectorClass, dataSource) {
    return selectorClassInvisibility[selectorClass][dataSource]
  }
  function isRemovedDataInvisible(selectorClass, isRemoved) {
    return isRemoved && selectorClassInvisibility[selectorClass][IS_DATA_REMOVED]
  }

  const nestedLists = []

  const cutscenes = Object.keys(gameModel.cutscenes).filter((currentCutsceneId) => {
    const currentCutscene = gameModel.cutscenes[currentCutsceneId]
    if(currentCutscene.isRemoved) return false
    if(currentCutscene.inDialogueMenu) return false
    return true
  }).map((currentCutsceneId, i) => {
    const currentCutscene = gameModel.cutscenes[currentCutsceneId]
    return <Unlockable interfaceId={CUTSCENE_SELECT_IID}>
      <NestedListItem title={currentCutscene.name} onClick={() => {openCreateCutscene(currentCutscene)}}/>
    </Unlockable>
  })

  cutscenes.push(<Unlockable interfaceId={CUTSCENE_ADD_IID}>
    <NestedListItemButton>
      <Button onClick={() => {
        openCreateCutscene({
          inDialogueMenu: false
        })
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: CUTSCENE_CONTAINER_IID,
    title: 'Cutscenes',
    id: 'Cutscenes',
    children: cutscenes,
    // moreMenu: <SelectorMoreMenu selectorClass={CUTSCENE_ABSTRACT_CLASS}/>
  })


  const dialogueScenes = Object.keys(gameModel.cutscenes).filter((currentCutsceneId) => {
    const currentCutscene = gameModel.cutscenes[currentCutsceneId]
    if(currentCutscene.isRemoved) return false
    if(!currentCutscene.inDialogueMenu) return false
    return true
  }).map((currentCutsceneId, i) => {
    const currentCutscene = gameModel.cutscenes[currentCutsceneId]
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
    children: dialogueScenes,
    // moreMenu: <SelectorMoreMenu selectorClass={DIALOGUE_ABSTRACT_CLASS}/>
  })

  const relationTags = Object.keys(gameModel.relationTags).filter((currentRelationTagId) => {
    const currentTag = gameModel.relationTags[currentRelationTagId]
    if(isRemovedDataInvisible(RELATION_TAG_ABSTRACT_CLASS, currentTag.isRemoved)) return false
    if(isDataSourceInvisible(RELATION_TAG_ABSTRACT_CLASS, currentTag.dataSource)) return false
    return true
  }).map((currentRelationTagId, i) => {
    return <RelationTagItem relationTagId={currentRelationTagId}/>
  })

  relationTags.push(<Unlockable interfaceId={RELATION_TAG_ADD_IID}>
    <NestedListItemButton
      >
      <Button onClick={() => {
        openCreateRelationTag()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: RELATION_TAG_CONTAINER_IID,
    title: 'Relationship Tags',
    id: 'Relation Tags',
    children: relationTags,
    moreMenu: <SelectorMoreMenu selectorClass={RELATION_TAG_ABSTRACT_CLASS}/>
  })

  const relations = Object.keys(gameModel.relations).filter((currentRelationId) => {
    const currentRelation = gameModel.relations[currentRelationId]
    if(isRemovedDataInvisible(RELATION_ABSTRACT_CLASS, currentRelation.isRemoved)) return false
    if(isDataSourceInvisible(RELATION_ABSTRACT_CLASS, currentRelation.dataSource)) return false
    return true
  }).map((currentRelationId, i) => {
    return <RelationItem relationId={currentRelationId}/>
  })

  relations.push(<Unlockable interfaceId={RELATION_ADD_IID}>
    <NestedListItemButton
      >
      <Button onClick={() => {
        openCreateRelation()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: RELATION_CONTAINER_IID,
    title: 'Relationships',
    id: 'Relations',
    children: relations,
    moreMenu: <SelectorMoreMenu selectorClass={RELATION_ABSTRACT_CLASS}/>
  })

  const effects = Object.keys(gameModel.effects).filter((currentEffectId) => {
    const currentEffect = gameModel.effects[currentEffectId]
    if(isRemovedDataInvisible(EFFECT_ABSTRACT_CLASS, currentEffect.isRemoved)) return false
    if(isDataSourceInvisible(EFFECT_ABSTRACT_CLASS, currentEffect.dataSource)) return false
    return true
  }).map((effectId, i) => {
    return <EffectItem effectId={effectId}/>
  })

  effects.push(<Unlockable interfaceId={EFFECT_ADD_IID}>
    <NestedListItemButton
      >
      <Button onClick={() => {
        openCreateEffect()
      }}>+</Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: EFFECT_CONTAINER_IID,
    title: 'Effects',
    id: 'Effects',
    children: effects,
    moreMenu: <SelectorMoreMenu selectorClass={EFFECT_ABSTRACT_CLASS}/>
  })


  const events = Object.keys(gameModel.events).filter((currentEventId) => {
    const currentEvent = gameModel.events[currentEventId]
    if(isRemovedDataInvisible(EVENT_ABSTRACT_CLASS, currentEvent.isRemoved)) return false
    if(isDataSourceInvisible(EVENT_ABSTRACT_CLASS, currentEvent.dataSource)) return false
    return true
  }).map((currentEventId, i) => {
    const currentEvent = gameModel.events[currentEventId]
    return <Unlockable interfaceId={EVENT_SELECT_IID}>
      <NestedListItem
        onClick={() => {openCreateEvent(currentEvent)}}
      >
        <EventShorthand event={currentEvent}/>
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

  nestedLists.push({
    interfaceId: EVENT_CONTAINER_IID,
    title: 'Events',
    id: 'Events',
    children: events,
    moreMenu: <SelectorMoreMenu selectorClass={EVENT_ABSTRACT_CLASS}/>
  })

  return <div className="SelectorAbstractList">
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
  gameSelector: state.gameSelector,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { editGameModel, openEditEntityGraphics, openCreateEvent, openCreateEffect, openCreateRelationTag, openCreateCutscene, openCreateRelation, openEntityBoxModal }),
)(SelectorAbstractList);
