/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { closeEntityBoxModal } from '../../../store/actions/game/gameSelectorActions';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import './EntityBoxModal.scss'
import EntityBoxList from '../EntityBoxList/EntityBoxList';
import EntityModelAdd from '../EntityModelAdd/EntityModelAdd';
import { ENTITY_BOX_IID } from '../../../constants/interfaceIds';
import Button from '../../../ui/Button/Button';
import { entityModelTypeToDisplayName } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import EditEntityGraphics from '../EditEntityGraphics/EditEntityGraphics';
import { addEntityModelToLibrary } from '../../../store/actions/library/entityModelLibraryActions';
import { editGameModel } from '../../../store/actions/game/gameModelActions';

const EntityBoxModal = ({ 
  closeEntityBoxModal, 
  gameSelector: { entityBoxModelType }, 
  gameFormEditor: { isEditEntityGraphicsOpen },
  gameModel : { gameModel : { entityModels }},
  addEntityModelToLibrary,
  editGameModel
 }) => {
  function handleClose(entityModelId) {
    closeEntityBoxModal()
  }

  const entityModelsToSelect = Object.keys(entityModels).map((entityModelId) => {
    return entityModels[entityModelId]
  }).filter((entityModel) => {
    return entityModel.entityInterfaceId === entityBoxModelType
  })

  return <><CobrowsingModal open onClose={handleClose}>
    <div className="EntityBoxModal">
      <EntityModelAdd entityInterfaceId={entityBoxModelType} parentInterfaceId={ENTITY_BOX_IID}>
      {(onClick) => {
        return <Button size="wide" startIcon={<Icon icon="faPlus"/>}onClick={onClick}>
          Add {entityModelTypeToDisplayName[entityBoxModelType]}
        </Button>
      }}
      </EntityModelAdd>
      <EntityBoxList entityModels={entityModelsToSelect} onSelectEntity={(entityModelId) => {
        editGameModel({
          entityModels: {
            [entityModelId]: {
              isImported: true
            }
          }
        })
        handleClose()
      }}/>
    </div>
  </CobrowsingModal>
    {isEditEntityGraphicsOpen === ENTITY_BOX_IID && <EditEntityGraphics 
      onComplete={(entityModel) => {
        addEntityModelToLibrary(entityModel)
      }}
  />}
  </>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { closeEntityBoxModal, addEntityModelToLibrary, editGameModel }),
)(EntityBoxModal);
