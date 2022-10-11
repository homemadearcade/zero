/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './RelationsMenu.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeRelationsMenu, updateCreateCutscene } from '../../store/actions/gameFormEditorActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';

const RelationsMenu = ({ closeRelationsMenu, gameFormEditor: { classIdRelationsMenu }, game: { gameModel } }) => {
  function handleClose() {
    closeRelationsMenu()
  }

  // onChange={(event, descriptors) => {
  //   updateCreateCutscene({ descriptors })
  // }}

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="RelationsMenu">
      <ClassMemberTitle classId={classIdRelationsMenu} title="Relations"/>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  game: state.game,

})

export default compose(
  connect(mapStateToProps, { updateCreateCutscene, closeRelationsMenu }),
)(RelationsMenu);
