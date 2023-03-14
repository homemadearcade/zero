/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameplayDataList.scss';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { openCreateClassFlow, openCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import {  DIALOGUE_ADD_IID, DIALOGUE_CONTAINER_IID, DIALOGUE_SELECT_IID } from '../../../constants/interfaceIds';
import { openClassBoxModal } from '../../../store/actions/gameSelectorActions';
import { NestedListContainer, NestedListItem } from '../../../ui/NestedList/NestedList';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';

const DATA_MAX = 16

const GameplayDataList = ({
  gameModel: { gameModel },
  openCreateCutscene,
}) => {
  const cutscenes = gameModel?.cutscenes

  if(!cutscenes) {
    return null
  }

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
    <NestedListItem 
      title="Add Dialogue"
      onClick={() => {
        openCreateCutscene({
          inDialogueMenu: true
        })
    }}>
    </NestedListItem>
  </Unlockable>)

  const nestedLists = []
  nestedLists.push({
    interfaceId: DIALOGUE_CONTAINER_IID,
    title: 'Dialogue',
    id: 'Dialogue',
    children: dialogueScenes
  })

  return <div className="GameplayDataList">
    <NestedListContainer>
      {nestedLists.map((props) => {
        console.log(props)
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
  connect(mapStateToProps, { editGameModel, openCreateClassFlow, openCreateCutscene, openClassBoxModal }),
)(GameplayDataList);
