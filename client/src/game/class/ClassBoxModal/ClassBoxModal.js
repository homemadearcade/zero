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

const ClassBoxModal = ({ closeClassBoxModal, gameSelector: { classBoxClassType }, gameModel : { gameModel : { entityClasses }} }) => {
  function handleClose() {
    closeClassBoxModal()
  }

  const entityClassesToSelect = Object.keys(entityClasses).map((entityClassId) => {
    return entityClasses[entityClassId]
  }).filter((entityClass) => {
    return entityClass.classInterfaceCategory === classBoxClassType
  }).map((entityClass) => {
    return <ClassItem onClick={handleClose} entityClassId={entityClass.entityClassId}></ClassItem>
  })

  return <CobrowsingModal open onClose={handleClose}>
    <div className="ClassBoxModal">
      <BorderedGrid
      
        height="7vh"
        width="9.2vh"
        items={entityClassesToSelect}
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
