/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditEntityGraphics.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../../ui/SelectDescriptors/SelectDescriptors';
import { clearGameFormEditor, closeEditEntityGraphics, updateCreateEntity, openEditEntityModal } from '../../../store/actions/game/gameFormEditorActions';
import CreateTexture from '../../textures/CreateTexture/CreateTexture';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getEntityDisplayName } from '../../../utils/gameUtils';
import EntityMemberTitle from '../EntityMemberTitle/EntityMemberTitle';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { entityModelTypeToDisplayName, LAYER_ID_PREFIX } from '../../constants';
import Switch from '../../../ui/Switch/Switch';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { generateUniqueId } from '../../../utils/webPageUtils';
import SelectLayer from '../../ui/SelectLayer/SelectLayer';
import { PLAYER_CLASS, ENTITY_MODEL_ID_PREFIX, PLAYGROUND_LAYER_ID, ZONE_CLASS, entityModelTypeToPrefix } from '../../constants';
import { CLASS_LAYER_IID, CLASS_LOCK_IID, CLASS_VISIBILITY_IID } from '../../../constants/interfaceIds';
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
  
  useEffect(() => {
    if(!entityModel.entityModelId) {
      updateCreateEntity({ entityModelId: ENTITY_MODEL_ID_PREFIX+entityModelTypeToPrefix[entityModel.entityInterfaceId]+generateUniqueId(), isNew: true })
    }
  }, [])

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="EditEntityGraphics">
      {entityModel.isNew === true && <Typography component="h2" variant="h2">New {entityModelTypeToDisplayName[entityModel.entityInterfaceId]}</Typography>}
      {entityModel.isNew === false && <EntityMemberTitle entityModelId={entityModel.entityModelId} title="Graphics"></EntityMemberTitle>}
      <Unlockable interfaceId={CLASS_VISIBILITY_IID}>
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
      {entityModel.entityInterfaceId === ZONE_CLASS && 
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
      {entityModel.entityInterfaceId !== ZONE_CLASS && entityModel.entityInterfaceId !== PLAYER_CLASS && <Unlockable interfaceId={CLASS_LAYER_IID}>
        <SelectLayer formLabel={"Layer"} value={entityModel.graphics.layerId ? [entityModel.graphics.layerId] : [LAYER_ID_PREFIX+PLAYGROUND_LAYER_ID]} onChange={(e, value) => {
          const newValue = value[value.length-1]
          if(newValue) updateCreateEntity({ graphics: {
            layerId: newValue
          }})
        }}/>
      </Unlockable>}
      {entityModel.isNew && <EntityNameForm isEditingInitially></EntityNameForm>}
      {entityModel.isNew && <Unlockable interfaceId={CLASS_LOCK_IID}>
        <Switch
          labels={['Normal', 'Hide from UI unless unlocked']}
          size="small"
          onChange={(e) => {
            updateCreateEntity({ editorInterface: {
              requiresUnlocking: e.target.checked
            } })          
          }}
          checked={entityModel.editorInterface.requiresUnlocking}
         />
      </Unlockable>}
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
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEntity, closeEditEntityGraphics, clearGameFormEditor }),
)(EditEntityGraphics);
