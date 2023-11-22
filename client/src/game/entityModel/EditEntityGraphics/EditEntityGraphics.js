/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditEntityGraphics.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import SelectVisualTags from '../../ui/SelectVisualTags/SelectVisualTags';
import { clearGameFormEditor, closeEditEntityGraphics, updateCreateEntity } from '../../../store/actions/game/gameFormEditorActions';
import CreateTexture from '../../textures/CreateTexture/CreateTexture';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getEntityDisplayName } from '../../../utils/gameUtils';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { entityModelClassToDisplayName } from '../../constants';
import Switch from '../../../ui/Switch/Switch';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { generateUniqueId } from '../../../utils/webPageUtils';
import SelectLayer from '../../ui/SelectLayer/SelectLayer';
import { ENTITY_MODEL_DID, entityModelClassToPrefix } from '../../constants';
import { ENTITY_LAYER_IID, ENTITY_INVISIBLE_IID, PLAYER_ENTITY_IID, ZONE_ENTITY_IID, PLAYGROUND_LAYER_GROUP_IID, ENTITY_VISUAL_TAGS_IID } from '../../../constants/interfaceIds';
import EntityNameForm from '../EntityNameForm/EntityNameForm';

const EditEntityGraphics = ({ 
  onComplete,
  clearGameFormEditor,
  updateCreateEntity,
  closeEditEntityGraphics,
  gameFormEditor: { entityModel },
  gameModel: { gameModel },
}) => {
  function handleClose() {
    closeEditEntityGraphics()
    clearGameFormEditor()
  }

  const defaultEntityModelName = `New ${entityModelClassToDisplayName[entityModel.entityClassIID]} #${Object.keys(gameModel.entityModels).length + 1}`
  useEffect(() => {
    if(!entityModel.entityModelId) {
      updateCreateEntity({ 
        entityModelId: ENTITY_MODEL_DID+entityModelClassToPrefix[entityModel.entityClassIID]+generateUniqueId(), 
        isNew: true,
        name: defaultEntityModelName,
       })
    }
  }, [])

  return <CobrowsingDialog open={true}>
    <div className="EditEntityGraphics">
      <EntityNameForm initialName={entityModel.name || defaultEntityModelName} />
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
        <Unlockable interfaceId={ENTITY_VISUAL_TAGS_IID}><SelectVisualTags
          onChange={(event, visualTags) => {
            let newName = entityModel.name || ''
            const nameFromDesc = getEntityDisplayName(visualTags)

            if((!newName || newName === defaultEntityModelName) && nameFromDesc) {
              newName = nameFromDesc
            }
            
            updateCreateEntity({ visualTags, name: newName })
          }}
          formLabel="Descriptors"
          value={entityModel.visualTags}
        /></Unlockable> 
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
      {entityModel.entityClassIID === ZONE_ENTITY_IID && 
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
      {entityModel.entityClassIID !== ZONE_ENTITY_IID && entityModel.entityClassIID !== PLAYER_ENTITY_IID && <Unlockable interfaceId={ENTITY_LAYER_IID}>
        <SelectLayer formLabel={"Layer"} value={entityModel.graphics.layerGroupIID ? [entityModel.graphics.layerGroupIID] : [PLAYGROUND_LAYER_GROUP_IID]} onChange={(e, value) => {
          const newValue = value[value.length-1]
          if(newValue) updateCreateEntity({ graphics: {
            layerGroupIID: newValue
          }})
        }}/>
      </Unlockable>}
      <Button
        onClick={() => {
          onComplete(entityModel)
          handleClose()
        }}
      >
        {entityModel.isNew ? 'Create' : 'Save'}
      </Button>
      <Button onClick={handleClose}>
        Cancel
      </Button>
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateEntity, closeEditEntityGraphics, clearGameFormEditor }),
)(EditEntityGraphics);
