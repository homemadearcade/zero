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
import { effectDisplayNames, eventDisplayNames, getEffectLabel, getEventLabel } from '../../defaultData/relationship';

const RelationsMenu = ({ closeRelationsMenu, openCreateRelation, gameFormEditor: { classIdRelationsMenu }, game: { gameModel } }) => {
  function handleClose() {
    closeRelationsMenu()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}
  const objectClass = gameModel.classes[classIdRelationsMenu]

  const relations = Object.keys(objectClass.relations).map((relationId) => {
    return objectClass.relations[relationId]
  })

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="RelationsMenu">
      <ClassMemberTitle classId={classIdRelationsMenu} title="Relations"/>
      {relations.map((relation) => {
        const { classId, event, effect: { type, effectedClassId }} = relation

        const effectedClass = gameModel.classes[effectedClassId]
        const agentClass = gameModel.classes[classId]

        return <div key={relation.relationId} className="RelationsMenu__relation">
          <ClassMemberTitle classId={classId} title={getEffectLabel(type, effectedClass, agentClass) + getEventLabel(event, effectedClass, agentClass)}/>
          <Button onClick={() => {
            openCreateRelation(relation)
          }}>Edit</Button>
        </div>
      })}
      <Button onClick={() => {
        openCreateRelation({
          // effectedClassId: classIdRelationsMenu
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
