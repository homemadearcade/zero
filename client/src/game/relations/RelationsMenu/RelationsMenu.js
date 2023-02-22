/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './RelationsMenu.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeRelationsMenu, openCreateRelation, openBoundaryRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import { getEffectLabel, getEventPreviewLabel } from '../../defaultData/relationship';
import { getBoundaryRelationLabel } from '../../defaultData/stage';
import { EFFECT_COLLIDE, PLAYER_INSTANCE_ID_PREFIX } from '../../constants';
import { getClassAandB } from '../../../utils/gameUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { RELATION_BOUNDARY_IID } from '../../../constants/interfaceIds';

const RelationsMenu = ({ closeRelationsMenu, openBoundaryRelation,  openCreateRelation, gameFormEditor: { classIdRelationsMenu }, gameModel: { gameModel }, playerInterface: { playerClassId } }) => {
  function handleClose() {
    closeRelationsMenu()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}

  const objectClass = gameModel.classes[classIdRelationsMenu]

  const relations = Object.keys(gameModel.relations).map((relationId) => {
    return gameModel.relations[relationId]
  }).filter((relation) => {
    return relation.event.classIdA === classIdRelationsMenu
  })

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="RelationsMenu">
      <ClassMemberTitle classId={classIdRelationsMenu} title="Relationships"/>
      <Unlockable interfaceId={RELATION_BOUNDARY_IID}>
        <ClassMemberTitle classId={classIdRelationsMenu} title={getBoundaryRelationLabel(objectClass.boundaryRelation, objectClass)}/>
        <Button onClick={() => {
          openBoundaryRelation(objectClass)
        }}>Edit</Button>
      </Unlockable>
      {relations.map((relation) => {
        const { event, effect: { type, remoteEffectedClassId }} = relation

        // if the class dont exist, its the player class ( as of now thats the only generalized one)
        let effectedClass = gameModel.classes[remoteEffectedClassId];
        if(remoteEffectedClassId === PLAYER_INSTANCE_ID_PREFIX) {
          effectedClass = {...gameModel.classes[playerClassId], name: 'Player'}
        }
        const { classA, classB } = getClassAandB(event.classIdA, event.classIdB)

        if(type === EFFECT_COLLIDE) return null

        let classIdB  = event.classIdB
        if(classIdB === PLAYER_INSTANCE_ID_PREFIX) {
          classIdB = playerClassId
        }

        return <div key={relation.relationId} className="RelationsMenu__relation">
          <ClassMemberTitle classId={classIdB} title={getEffectLabel(type, (effectedClass || classA), classB) + getEventPreviewLabel(event.type, classA, classB)}/>
          <Button onClick={() => {
            openCreateRelation(relation)
          }}>Edit</Button>
        </div>
      })}
      <Button startIcon={<Icon icon="faPlus"/>} onClick={() => {
        openCreateRelation({
          event: {
            classIdA: classIdRelationsMenu
          } 
        })
      }}>New Relationship</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
  playerInterface: state.playerInterface
})

export default compose(
  connect(mapStateToProps, { openCreateRelation, closeRelationsMenu, openBoundaryRelation }),
)(RelationsMenu);
