/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RelationSystemList.scss';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { openEditEntityGraphics, openCreateCutscene, openCreateEffect, openCreateEvent, openCreateRelation, openCreateRelationTag } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import {  TEXT_SCENE_ADD_IID, TEXT_SCENE_CONTAINER_IID, TEXT_SCENE_SELECT_IID, EFFECT_LIST_IID, EFFECT_ADD_IID, EFFECT_CONTAINER_IID, EVENT_LIST_IID, EVENT_ADD_IID, EVENT_CONTAINER_IID, EVENT_SELECT_IID, IS_DATA_REMOVED_IID, RELATION_LIST_IID, RELATION_ADD_IID, RELATION_CONTAINER_IID, RELATION_TAG_LIST_IID, RELATION_TAG_ADD_IID, RELATION_TAG_CONTAINER_IID } from '../../../constants/interfaceIds';
import { openEntityBoxDialog } from '../../../store/actions/game/gameSelectorActions';
import { NestedListContainer, NestedListItem, NestedListItemButton } from '../../../ui/NestedList/NestedList';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import RelationItem from '../RelationItem/RelationItem';
import { CUTSCENE_ADD_IID, CUTSCENE_CONTAINER_IID, CUTSCENE_SELECT_IID } from '../../../constants/interfaceIds/cutsceneInterfaceIds';
import EventShorthand from '../../event/EventShorthand/EventShorthand';
import RelationTagItem from '../../tags/RelationTagItem/RelationTagItem';
import EffectItem from '../../effect/EffectItem/EffectItem';
import SelectorMoreMenu from '../../selector/SelectorMoreMenu/SelectorMoreMenu';
import Icon from '../../../ui/Icon/Icon';

const RelationSystemList = ({
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

  function isDataSourceInvisible(interfaceId, dataSourceIID) {
    return selectorInterfaceListInvisibility[interfaceId][dataSourceIID]
  }
  function isRemovedDataInvisible(interfaceId, isRemoved) {
    return isRemoved && selectorInterfaceListInvisibility[interfaceId][IS_DATA_REMOVED_IID]
  }

  const nestedLists = []

  // const cutscenes = Object.keys(gameModel.cutscenes).filter((currentCutsceneId) => {
  //   const currentCutscene = gameModel.cutscenes[currentCutsceneId]
  //   if(currentCutscene.isRemoved) return false
  //   if(currentCutscene.isTextSceneOnly) return false
  //   return true
  // }).map((currentCutsceneId, i) => {
  //   const currentCutscene = gameModel.cutscenes[currentCutsceneId]
  //   return <Unlockable key={currentCutsceneId} interfaceId={CUTSCENE_SELECT_IID}>
  //     <NestedListItem title={currentCutscene.name} onClick={() => {openCreateCutscene(currentCutscene)}}/>
  //   </Unlockable>
  // })

  // cutscenes.push(<Unlockable key="add cutscene" interfaceId={CUTSCENE_ADD_IID}>
  //   <NestedListItemButton>
  //     <Button onClick={() => {
  //       openCreateCutscene({
  //         isTextSceneOnly: false
  //       })
  //     }}>+</Button>
  //   </NestedListItemButton>
  // </Unlockable>)

  // nestedLists.push({
  //   interfaceId: CUTSCENE_CONTAINER_IID,
  //   title: 'Cutscenes',
  //   children: cutscenes,
  //   // moreMenu: <SelectorMoreMenu interfaceId={CUTSCENE_IID}/>
  // })


  // const scriptScenes = Object.keys(gameModel.cutscenes).filter((currentCutsceneId) => {
  //   const currentCutscene = gameModel.cutscenes[currentCutsceneId]
  //   if(currentCutscene.isRemoved) return false
  //   if(!currentCutscene.isTextSceneOnly) return false
  //   return true
  // }).map((currentCutsceneId, i) => {
  //   const currentCutscene = gameModel.cutscenes[currentCutsceneId]
  //   return <Unlockable key={currentCutsceneId} interfaceId={TEXT_SCENE_SELECT_IID}>
  //     <NestedListItem title={currentCutscene.name} onClick={() => {openCreateCutscene(currentCutscene)}}/>
  //   </Unlockable>
  // })

  // scriptScenes.push(<Unlockable key="add dialog" interfaceId={TEXT_SCENE_ADD_IID}>
  //   <NestedListItemButton>
  //     <Button onClick={() => {
  //       openCreateCutscene({
  //         isTextSceneOnly: true
  //       })
  //     }}>+</Button>
  //   </NestedListItemButton>
  // </Unlockable>)

  // nestedLists.push({
  //   interfaceId: TEXT_SCENE_CONTAINER_IID,
  //   title: 'Scripts',
  //   children: scriptScenes,
  //   // moreMenu: <SelectorMoreMenu interfaceId={TEXT_SCENE_IID}/>
  // })

  const relationTags = Object.keys(gameModel.relationTags).filter((currentRelationTagId) => {
    const currentTag = gameModel.relationTags[currentRelationTagId]
    if(isRemovedDataInvisible(RELATION_TAG_LIST_IID, currentTag.isRemoved)) return false
    if(isDataSourceInvisible(RELATION_TAG_LIST_IID, currentTag.dataSourceIID)) return false
    return true
  }).map((currentRelationTagId, i) => {
    return <RelationTagItem  key={currentRelationTagId} relationTagId={currentRelationTagId}/>
  })

  relationTags.push(<Unlockable key={'add relation tag'} interfaceId={RELATION_TAG_ADD_IID}>
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
    moreMenu: <SelectorMoreMenu interfaceId={RELATION_TAG_LIST_IID}/>
  })

  const relations = Object.keys(gameModel.relations).filter((currentRelationId) => {
    const currentRelation = gameModel.relations[currentRelationId]
    if(isRemovedDataInvisible(RELATION_LIST_IID, currentRelation.isRemoved)) return false
    if(isDataSourceInvisible(RELATION_LIST_IID, currentRelation.dataSourceIID)) return false
    return true
  }).map((currentRelationId, i) => {
    return <RelationItem key={currentRelationId} relationId={currentRelationId}/>
  })

  relations.push(<Unlockable key={'add relation'} interfaceId={RELATION_ADD_IID}>
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
    moreMenu: <SelectorMoreMenu interfaceId={RELATION_LIST_IID}/>
  })

  const effects = Object.keys(gameModel.effects).filter((currentEffectId) => {
    const currentEffect = gameModel.effects[currentEffectId]
    if(isRemovedDataInvisible(EFFECT_LIST_IID, currentEffect.isRemoved)) return false
    if(isDataSourceInvisible(EFFECT_LIST_IID, currentEffect.dataSourceIID)) return false
    return true
  }).map((effectId, i) => {
    return <EffectItem key={effectId} effectId={effectId}/>
  })

  effects.push(<Unlockable key={'effect add'} interfaceId={EFFECT_ADD_IID}>
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
    moreMenu: <SelectorMoreMenu interfaceId={EFFECT_LIST_IID}/>
  })

  const events = Object.keys(gameModel.events).filter((currentEventId) => {
    const currentEvent = gameModel.events[currentEventId]
    if(isRemovedDataInvisible(EVENT_LIST_IID, currentEvent.isRemoved)) return false
    if(isDataSourceInvisible(EVENT_LIST_IID, currentEvent.dataSourceIID)) return false
    return true
  }).map((currentEventId, i) => {
    const currentEvent = gameModel.events[currentEventId]
    return <Unlockable key={currentEventId} interfaceId={EVENT_SELECT_IID}>
      <NestedListItem
        onClick={() => {openCreateEvent(currentEvent)}}
      >
        <EventShorthand event={currentEvent}/>
      </NestedListItem>
    </Unlockable>
  })

  events.push(<Unlockable key="add event" interfaceId={EVENT_ADD_IID}>
    <NestedListItemButton>
      <Button onClick={() => {
        openCreateEvent()
      }}><Icon icon="faPlus"/></Button>
    </NestedListItemButton>
  </Unlockable>)

  nestedLists.push({
    interfaceId: EVENT_CONTAINER_IID,
    title: 'Events',
    children: events,
    moreMenu: <SelectorMoreMenu interfaceId={EVENT_LIST_IID}/>
  })

  return <div className="RelationSystemList">
    <NestedListContainer>
      {nestedLists.map((props) => {
        return <CobrowsingNestedList key={props.interfaceId}
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
})
export default compose(
  connect(mapStateToProps, { editGameModel, openEditEntityGraphics, openCreateEvent, openCreateEffect, openCreateRelationTag, openCreateCutscene, openCreateRelation, openEntityBoxDialog }),
)(RelationSystemList);
