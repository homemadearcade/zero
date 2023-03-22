/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './EditClassGraphics.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../../ui/SelectDescriptors/SelectDescriptors';
import { clearGameFormEditor, closeEditClassGraphics, updateCreateClass, openEditClassModal } from '../../../store/actions/gameFormEditorActions';
import CreateTexture from '../../images/CreateTexture/CreateTexture';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getClassDisplayName } from '../../../utils/gameUtils';
import ClassMemberTitle from '../../entityClass/ClassMemberTitle/ClassMemberTitle';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { classTypeToDisplayName, LAYER_ID_PREFIX } from '../../constants';
import Switch from '../../../ui/Switch/Switch';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { generateUniqueId } from '../../../utils/webPageUtils';
import SelectLayer from '../../ui/SelectLayer/SelectLayer';
import { PLAYER_CLASS, OBJECT_CLASS_ID_PREFIX, PLAYGROUND_LAYER_CANVAS_ID, ZONE_CLASS, classTypeToPrefix } from '../../constants';
import { CLASS_LAYER_IID, CLASS_LOCK_IID, CLASS_VISIBILITY_IID } from '../../../constants/interfaceIds';
import ClassNameForm from '../ClassNameForm/ClassNameForm';

const EditClassGraphics = ({ 
  onComplete,
  clearGameFormEditor,
  updateCreateClass,
  closeEditClassGraphics,
  gameFormEditor: { entityClass },
}) => {
  function handleClose() {
    closeEditClassGraphics()
    clearGameFormEditor()
  }
  
  useEffect(() => {
    if(!entityClass.entityClassId) {
      updateCreateClass({ entityClassId: OBJECT_CLASS_ID_PREFIX+classTypeToPrefix[entityClass.classInterfaceCategory]+generateUniqueId(), isNew: true })
    }
  }, [])

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="EditClassGraphics">
      {entityClass.isNew === true && <Typography component="h2" variant="h2">New {classTypeToDisplayName[entityClass.classInterfaceCategory]}</Typography>}
      {entityClass.isNew === false && <ClassMemberTitle entityClassId={entityClass.entityClassId} title="Graphics"></ClassMemberTitle>}
      <Unlockable interfaceId={CLASS_VISIBILITY_IID}>
        <Switch
          labels={['Visible', 'Invisible']}
          size="small"
          onChange={(e) => {
            updateCreateClass({ graphics: {
              invisible: e.target.checked
           }})          
          }}
          checked={entityClass.graphics.invisible}
         />
      </Unlockable>
      {!entityClass.graphics.invisible && <>
        <SelectDescriptors
          onChange={(event, visualTags) => {
            let newName = entityClass.name || ''
            const nameFromDesc = getClassDisplayName(visualTags)

            if(!newName && nameFromDesc) {
              newName = nameFromDesc
            }
            
            updateCreateClass({ visualTags, name: newName })
          }}
          formLabel="Descriptors"
          value={entityClass.visualTags}
        />
        <CreateTexture
          onSelect={(textureId) => {
            updateCreateClass({ graphics: {
              textureId,
              textureTint: null,
            }})
          }}
          textureTintSelected={entityClass.graphics.textureTint}
          onSelectTint={(textureTint) => {
            updateCreateClass({ graphics: {
              textureTint
            }})
          }}
          onClearTint={() => {
            updateCreateClass({ graphics: {
              textureTint: null
            }})
          }}
          visualTags={entityClass.visualTags}
          textureIdSelected={entityClass.graphics.textureId}
        />
      </>}
      {entityClass.classInterfaceCategory === ZONE_CLASS && 
        <AggregateColorSelect
          selectedColor={entityClass.graphics.textureTint}
          onSelectColor={(textureTint) => {
            updateCreateClass({ graphics: {
              textureTint
            }})
          }}
          onUnselectColor={() => {
            updateCreateClass({ graphics: {
              textureTint: null
            }})
          }}
      />}
      {entityClass.classInterfaceCategory !== ZONE_CLASS && entityClass.classInterfaceCategory !== PLAYER_CLASS && <Unlockable interfaceId={CLASS_LAYER_IID}>
        <SelectLayer formLabel={"Layer"} value={entityClass.graphics.layerId ? [entityClass.graphics.layerId] : [LAYER_ID_PREFIX+PLAYGROUND_LAYER_CANVAS_ID]} onChange={(e, value) => {
          const newValue = value[value.length-1]
          if(newValue) updateCreateClass({ graphics: {
            layerId: newValue
          }})
        }}/>
      </Unlockable>}
      {entityClass.isNew && <ClassNameForm></ClassNameForm>}
      {entityClass.isNew && <Unlockable interfaceId={CLASS_LOCK_IID}>
        <Switch
          labels={['Normal', 'Hide from UI unless unlocked']}
          size="small"
          onChange={(e) => {
            updateCreateClass({ interfaceLocked: e.target.checked })          
          }}
          checked={entityClass.interfaceLocked}
         />
      </Unlockable>}
      <Button
        disabled={!!entityClass.error || !entityClass.name.length}
        onClick={() => {
        onComplete(entityClass)
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
  connect(mapStateToProps, { updateCreateClass, closeEditClassGraphics, clearGameFormEditor }),
)(EditClassGraphics);
