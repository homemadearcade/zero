/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeClassBoxModal } from '../../../store/actions/gameSelectorActions';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import ClassItem from '../ClassItem/ClassItem';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import './ClassBoxModal.scss'

const ClassBoxModal = ({ closeClassBoxModal, gameSelector: { classBoxClassType }, gameModel : { gameModel : { classes }} }) => {
  function handleClose() {
    closeClassBoxModal()
  }

  const classesToSelect = Object.keys(classes).map((classId) => {
    return classes[classId]
  }).filter((objectClass) => {
    return objectClass.type === classBoxClassType
  }).map((objectClass) => {
    return <ClassItem onClick={handleClose} classId={objectClass.classId}></ClassItem>
  })

  return <CobrowsingModal open onClose={handleClose}>
    <div className="ClassBoxModal">
      <BorderedGrid
      
        height="7vh"
        width="9.2vh"
        items={classesToSelect}
      />
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameModel: state.gameModel
})

export default compose(
  connect(mapStateToProps, { closeClassBoxModal }),
)(ClassBoxModal);
