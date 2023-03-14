/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameplayDataList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { openCreateClassFlow, openCreateCutscene, openCreateTag } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import {  DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID, TAG_ADD_IID, TAG_CONTAINER_IID, TAG_SELECT_IID } from '../../../constants/interfaceIds';
import { openClassBoxModal } from '../../../store/actions/gameSelectorActions';
import { NestedListContainer, NestedListItem, NestedListItemButton } from '../../../ui/NestedList/NestedList';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';

const DATA_MAX = 16

const GameplayDataList = ({
  gameModel: { gameModel },
  openCreateTag,
  openCreateCutscene
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
    id: 'Dialogue',
    children: dialogueScenes
  })

  const tags = Object.keys(gameModel.tags).filter((currentTagId) => {
    const currentTag = gameModel.tags[currentTagId]
    if(currentTag.isRemoved) return false
    if(currentTag.isClassTag) return false
    if(currentTag.isSystemTag) return false
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
    id: 'Tag',
    children: tags
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
  connect(mapStateToProps, { editGameModel, openCreateClassFlow, openCreateTag, openCreateCutscene, openClassBoxModal }),
)(GameplayDataList);
