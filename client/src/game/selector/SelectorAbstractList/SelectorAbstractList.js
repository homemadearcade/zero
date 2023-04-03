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
import {  DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, EFFECT_ABSTRACT_IID, EFFECT_ADD_IID, EFFECT_CONTAINER_IID, EVENT_ABSTRACT_IID, EVENT_ADD_IID, EVENT_CONTAINER_IID, EVENT_SELECT_IID, IS_DATA_REMOVED_IID, RELATION_ABSTRACT_IID, RELATION_ADD_IID, RELATION_CONTAINER_IID, RELATION_TAG_ABSTRACT_IID, RELATION_TAG_ADD_IID, RELATION_TAG_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import { NestedListContainer, NestedListItem, NestedListItemButton } from '../../../ui/NestedList/NestedList';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import RelationItem from '../../relations/RelationItem/RelationItem';
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from '../../../constants/interfaceIds/cutsceneInterfaceIds';
import EventShorthand from '../../event/EventShorthand/EventShorthand';
import RelationTagItem from '../../tags/RelationTagItem/RelationTagItem';
import EffectItem from '../../effect/EffectItem/EffectItem';
import SelectorMoreMenu from '../SelectorMoreMenu/SelectorMoreMenu';

const SelectorAbstractList = ({
  gameModel: { gameModel },
  openCreateRelationTag,
  openCreateCutscene,
  openCreateEffect,
  openCreateEvent,
  openCreateRelation,
  gameSelector: { selectorInterfaceListInvisibility },
}) => {
  if(!gameModel.cutscenes) {
    return null
  }

  function isDataSourceInvisible(interfaceId, dataSourceId) {
    return selectorInterfaceListInvisibility[interfaceId][dataSourceId]
  }
  function isRemovedDataInvisible(interfaceId, isRemoved) {
    return isRemoved && selectorInterfaceListInvisibility[interfaceId][IS_DATA_REMOVED_IID]
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
    children: cutscenes,
    // moreMenu: <SelectorMoreMenu interfaceId={CUTSCENE_ABSTRACT_IID}/>
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
    children: dialogueScenes,
    // moreMenu: <SelectorMoreMenu interfaceId={DIALOGUE_ABSTRACT_IID}/>
  })

  const relationTags = Object.keys(gameModel.relationTags).filter((currentRelationTagId) => {
    const currentTag = gameModel.relationTags[currentRelationTagId]
    if(isRemovedDataInvisible(RELATION_TAG_ABSTRACT_IID, currentTag.isRemoved)) return false
    if(isDataSourceInvisible(RELATION_TAG_ABSTRACT_IID, currentTag.dataSourceId)) return false
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
    children: relationTags,
    moreMenu: <SelectorMoreMenu interfaceId={RELATION_TAG_ABSTRACT_IID}/>
  })

  const relations = Object.keys(gameModel.relations).filter((currentRelationId) => {
    const currentRelation = gameModel.relations[currentRelationId]
    if(isRemovedDataInvisible(RELATION_ABSTRACT_IID, currentRelation.isRemoved)) return false
    if(isDataSourceInvisible(RELATION_ABSTRACT_IID, currentRelation.dataSourceId)) return false
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
    children: relations,
    moreMenu: <SelectorMoreMenu interfaceId={RELATION_ABSTRACT_IID}/>
  })

  const effects = Object.keys(gameModel.effects).filter((currentEffectId) => {
    const currentEffect = gameModel.effects[currentEffectId]
    if(isRemovedDataInvisible(EFFECT_ABSTRACT_IID, currentEffect.isRemoved)) return false
    if(isDataSourceInvisible(EFFECT_ABSTRACT_IID, currentEffect.dataSourceId)) return false
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
    children: effects,
    moreMenu: <SelectorMoreMenu interfaceId={EFFECT_ABSTRACT_IID}/>
  })

  const events = Object.keys(gameModel.events).filter((currentEventId) => {
    const currentEvent = gameModel.events[currentEventId]
    if(isRemovedDataInvisible(EVENT_ABSTRACT_IID, currentEvent.isRemoved)) return false
    if(isDataSourceInvisible(EVENT_ABSTRACT_IID, currentEvent.dataSourceId)) return false
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
    children: events,
    moreMenu: <SelectorMoreMenu interfaceId={EVENT_ABSTRACT_IID}/>
  })

  return <div className="SelectorAbstractList">
    <NestedListContainer>
      {nestedLists.map((props) => {
        return <CobrowsingNestedList
          interfaceGroupId="SelectorColumns"
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
