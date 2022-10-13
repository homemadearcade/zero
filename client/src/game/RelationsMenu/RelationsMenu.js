/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './RelationsMenu.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeRelationsMenu, openCreateRelation } from '../../store/actions/gameFormEditorActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import { getEffectLabel, getEventLabel } from '../../defaultData/relationship';

const RelationsMenu = ({ closeRelationsMenu, openCreateRelation, gameFormEditor: { classIdRelationsMenu }, game: { gameModel } }) => {
  function handleClose() {
    closeRelationsMenu()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}
  const relations = Object.keys(gameModel.relations).map((relationId) => {
    return gameModel.relations[relationId]
  }).filter((relation) => {
    return relation.event.classIdA === classIdRelationsMenu
  })

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="RelationsMenu">
      <ClassMemberTitle classId={classIdRelationsMenu} title="Relations"/>
      {relations.map((relation) => {
        const { event, effect: { type, effectedClassId }} = relation

        const classA = gameModel.classes[event.classIdA]
        const effectedClass = gameModel.classes[effectedClassId]
        const classB = gameModel.classes[event.classIdB]

        return <div key={relation.relationId} className="RelationsMenu__relation">
          <ClassMemberTitle classId={event.classIdA} title={getEffectLabel(type, (effectedClass || classA), classB) + getEventLabel(event.type, classA, classB)}/>
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
      }}>Add Relation</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  game: state.game,

})

export default compose(
  connect(mapStateToProps, { openCreateRelation, closeRelationsMenu }),
)(RelationsMenu);
