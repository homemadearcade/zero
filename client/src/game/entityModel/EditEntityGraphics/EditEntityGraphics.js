/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditEntityGraphics.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import SelectDescriptors from '../../ui/SelectDescriptors/SelectDescriptors';
import { clearGameFormEditor, closeEditEntityGraphics, updateCreateEntity } from '../../../store/actions/game/gameFormEditorActions';
import CreateTexture from '../../textures/CreateTexture/CreateTexture';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getEntityDisplayName } from '../../../utils/gameUtils';
import EntityMemberTitle from '../EntityMemberTitle/EntityMemberTitle';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { entityModelTypeToDisplayName } from '../../constants';
import Switch from '../../../ui/Switch/Switch';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { generateUniqueId } from '../../../utils/webPageUtils';
import SelectLayer from '../../ui/SelectLayer/SelectLayer';
import { ENTITY_MODEL_DID, entityModelTypeToPrefix } from '../../constants';
import { ENTITY_LAYER_IID, ENTITY_INVISIBLE_IID, PLAYER_ENTITY_IID, ZONE_ENTITY_IID, PLAYGROUND_LAYER_GROUP_IID } from '../../../constants/interfaceIds';
import EntityNameForm from '../EntityNameForm/EntityNameForm';

const EditEntityGraphics = ({ 
  onComplete,
  clearGameFormEditor,
  updateCreateEntity,
  closeEditEntityGraphics,
  gameFormEditor: { entityModel },
}) => {
  function handleClose() {
    closeEditEntityGraphics()
    clearGameFormEditor()
  }
  
console.log('entityModel', entityModel)

  useEffect(() => {
    if(!entityModel.entityModelId) {
      updateCreateEntity({ entityModelId: ENTITY_MODEL_DID+entityModelTypeToPrefix[entityModel.entityIID]+generateUniqueId(), isNew: true })
    }
  }, [])

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="EditEntityGraphics">
      {entityModel.isNew === true && <Typography component="h2" variant="h2">New {entityModelTypeToDisplayName[entityModel.entityIID]}</Typography>}
      {entityModel.isNew === false && <EntityMemberTitle entityModelId={entityModel.entityModelId} title="Graphics"></EntityMemberTitle>}
      <Unlockable interfaceId={ENTITY_INVISIBLE_IID}>
        <Switch
          labels={['Visible', 'Invisible']}
          size="small"
          onChange={(e) => {
            updateCreateEntity({ graphics: {
              invisible: e.target.checked
           }})          
          }}
          checked={entityModel.graphics.invisible}
         />
      </Unlockable>
      {!entityModel.graphics.invisible && <>
        <SelectDescriptors
          onChange={(event, visualTags) => {
            let newName = entityModel.name || ''
            const nameFromDesc = getEntityDisplayName(visualTags)

            if(!newName && nameFromDesc) {
              newName = nameFromDesc
            }
            
            updateCreateEntity({ visualTags, name: newName })
          }}
          formLabel="Descriptors"
          value={entityModel.visualTags}
        />
        <CreateTexture
          onSelect={(textureId) => {
            updateCreateEntity({ graphics: {
              textureId,
              textureTint: null,
            }})
          }}
          textureTintSelected={entityModel.graphics.textureTint}
          onSelectTint={(textureTint) => {
            updateCreateEntity({ graphics: {
              textureTint
            }})
          }}
          onClearTint={() => {
            updateCreateEntity({ graphics: {
              textureTint: null
            }})
          }}
          visualTags={entityModel.visualTags}
          textureIdSelected={entityModel.graphics.textureId}
        />
      </>}
      {entityModel.entityIID === ZONE_ENTITY_IID && 
        <AggregateColorSelect
          selectedColor={entityModel.graphics.textureTint}
          onSelectColor={(textureTint) => {
            updateCreateEntity({ graphics: {
              textureTint
            }})
          }}
          onUnselectColor={() => {
            updateCreateEntity({ graphics: {
              textureTint: null
            }})
          }}
      />}
      {entityModel.entityIID !== ZONE_ENTITY_IID && entityModel.entityIID !== PLAYER_ENTITY_IID && <Unlockable interfaceId={ENTITY_LAYER_IID}>
        <SelectLayer formLabel={"Layer"} value={entityModel.graphics.layerGroupIID ? [entityModel.graphics.layerGroupIID] : [PLAYGROUND_LAYER_GROUP_IID]} onChange={(e, value) => {
          const newValue = value[value.length-1]
          if(newValue) updateCreateEntity({ graphics: {
            layerId: newValue
          }})
        }}/>
      </Unlockable>}
      {entityModel.isNew && <EntityNameForm isEditingInitially></EntityNameForm>}
      <Button
        disabled={!!entityModel.error || !entityModel.name.length}
        onClick={() => {
        onComplete(entityModel)
        handleClose()
      }}>
        Save
      </Button>
      <Button onClick={handleClose}>
        Cancel
      </Button>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEntity, closeEditEntityGraphics, clearGameFormEditor }),
)(EditEntityGraphics);
