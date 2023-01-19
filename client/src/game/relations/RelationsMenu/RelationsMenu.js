/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './RelationsMenu.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeRelationsMenu, openCreateRelation, openWorldRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import { getEffectLabel, getEventLabel, getEventPreviewLabel } from '../../defaultData/relationship';
import { getWorldBoundaryRelationLabel } from '../../defaultData/world';
import { EFFECT_COLLIDE, PLAYER_INSTANCE_ID } from '../../constants';
import { getClassAandB } from '../../../utils/gameUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';

const RelationsMenu = ({ closeRelationsMenu, openWorldRelation,  openCreateRelation, gameFormEditor: { classIdRelationsMenu }, gameModel: { gameModel } }) => {
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
      <Unlockable interfaceId="relations/world">
        <ClassMemberTitle classId={classIdRelationsMenu} title={getWorldBoundaryRelationLabel(objectClass.worldBoundaryRelation, objectClass)}/>
        <Button onClick={() => {
          openWorldRelation(objectClass)
        }}>Edit</Button>
      </Unlockable>
      {relations.map((relation) => {
        const { event, effect: { type, remoteEffectedClassId }} = relation

        // if the class dont exist, its the player class ( as of now thats the only generalized one)
        let effectedClass = gameModel.classes[remoteEffectedClassId];
        if(remoteEffectedClassId === PLAYER_INSTANCE_ID) {
          effectedClass = {...gameModel.classes[gameModel.player.initialClassId], name: 'Player'}
        }
        const { classA, classB } = getClassAandB(event.classIdA, event.classIdB)

        if(type === EFFECT_COLLIDE) return null

        let classIdB  = event.classIdB
        if(classIdB === PLAYER_INSTANCE_ID) {
          classIdB = gameModel.player.initialClassId
        }

        return <div key={relation.relationId} className="RelationsMenu__relation">
          <ClassMemberTitle classId={classIdB} title={getEffectLabel(type, (effectedClass || classA), classB) + getEventPreviewLabel(event.type, classA, classB)}/>
          <Button onClick={() => {
            openCreateRelation(relation)
          }}>Edit</Button>
        </div>
      })}
      <Button onClick={() => {
        openCreateRelation({
          event: {
            classIdA: classIdRelationsMenu
          } 
        })
      }}>Add Relationship</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { openCreateRelation, closeRelationsMenu, openWorldRelation }),
)(RelationsMenu);
