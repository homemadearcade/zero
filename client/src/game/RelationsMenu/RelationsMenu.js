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
import { effectDisplayNames, eventDisplayNames } from '../../defaultData/relationship';

const RelationsMenu = ({ closeRelationsMenu, openCreateRelation, gameFormEditor: { classIdRelationsMenu }, game: { gameModel } }) => {
  function handleClose() {
    closeRelationsMenu()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}

  const relations = Object.keys(gameModel.classes[classIdRelationsMenu].relations).map((relationId) => {
    return gameModel.classes[classIdRelationsMenu].relations[relationId]
  })

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="RelationsMenu">
      <ClassMemberTitle classId={classIdRelationsMenu} title="Relations"/>
      {relations.map((relation) => {
        const {classId, event, effect: { type }} = relation
        return <div className="RelationsMenu__relation">
          <ClassMemberTitle classId={classId} title={effectDisplayNames[type] +  ' When ' + eventDisplayNames[event]}/>
          <Button onClick={() => {
            openCreateRelation(relation)
          }}>Edit</Button>
        </div>
      })}
      <Button onClick={() => {
        openCreateRelation()
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
