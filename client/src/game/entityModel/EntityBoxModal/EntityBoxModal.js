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
import { editGameModel } from '../../../store/actions/game/gameModelActions';

const EntityBoxModal = ({ 
  closeEntityBoxModal, 
  gameSelector: { entityBoxModelType }, 
  gameFormEditor: { isEditEntityGraphicsOpen },
  gameModel : { gameModel, gameModel : { entityModels }},
  editGameModel
 }) => {

  function handleClose(e) {
    closeEntityBoxModal()
  }

  const entityModelsToSelect = Object.keys(entityModels).map((entityModelId) => {
    return entityModels[entityModelId]
  }).filter((entityModel) => {
    return entityModel.entityInterfaceId === entityBoxModelType
  })

  return <><CobrowsingModal open onClose={handleClose}>
    <div className="EntityBoxModal">
      <EntityModelAdd entityInterfaceId={entityBoxModelType} addEntityModalInterfaceId={ENTITY_BOX_IID}>
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
              isImported: true,
              entityModelId
            }
          }
        })
        handleClose()
      }}/>
    </div>
  </CobrowsingModal>
    {isEditEntityGraphicsOpen === ENTITY_BOX_IID && <EditEntityGraphics 
      onComplete={async (entityModel) => {
        editGameModel({
          entityModels: {
            [entityModel.entityModelId]: {
              ...entityModel,
              isNew: false,
              isImported: false
            }
          }
        })
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
  connect(mapStateToProps, { closeEntityBoxModal, editGameModel }),
)(EntityBoxModal);
