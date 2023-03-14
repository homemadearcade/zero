/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateClassFlow.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '../../ui/SelectDescriptors/SelectDescriptors';
import { clearGameFormEditor, closeCreateClassFlow, updateCreateClass, openClassNameModal } from '../../../store/actions/gameFormEditorActions';
import SelectSpriteInline from '../../sprites/SelectSpriteInline/SelectSpriteInline';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getClassDisplayName } from '../../../utils/gameUtils';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { classTypeToDisplayName } from '../../constants';
import Switch from '../../../ui/Switch/Switch';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { generateUniqueId } from '../../../utils/webPageUtils';
import SelectLayer from '../../ui/SelectLayer/SelectLayer';
import { PLAYER_CLASS, OBJECT_CLASS_ID_PREFIX, PLAYGROUND_CANVAS_ID, ZONE_CLASS, classTypeToPrefix } from '../../constants';
import { Alert } from '@mui/material';
import { CLASS_LAYER_IID, CLASS_LOCK_IID, CLASS_VISIBILITY_IID } from '../../../constants/interfaceIds';
import ClassNameForm from '../ClassNameForm/ClassNameForm';

const CreateClassFlow = ({ 
  onComplete,
  clearGameFormEditor,
  updateCreateClass,
  closeCreateClassFlow,
  gameFormEditor: { objectClass },
  openClassNameModal
}) => {
  function handleClose() {
    closeCreateClassFlow()
    clearGameFormEditor()
  }
  
  useEffect(() => {
    if(!objectClass.classId) {
      updateCreateClass({ classId: OBJECT_CLASS_ID_PREFIX+classTypeToPrefix[objectClass.type]+generateUniqueId(), isNew: true })
    }
  }, [])

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateClassFlow">
      {objectClass.isNew === true && <Typography component="h2" variant="h2">New {classTypeToDisplayName[objectClass.type]}</Typography>}
      {objectClass.isNew === false && <ClassMemberTitle classId={objectClass.classId} title="Graphics"></ClassMemberTitle>}
      <Unlockable interfaceId={CLASS_VISIBILITY_IID}>
        <Switch
          labels={['Visible', 'Invisible']}
          size="small"
          onChange={(e) => {
            updateCreateClass({ graphics: {
              invisible: e.target.checked
           }})          
          }}
          checked={objectClass.graphics.invisible}
         />
      </Unlockable>
      {!objectClass.graphics.invisible && <>
        <SelectDescriptors
          onChange={(event, descriptors) => {
            let newName = objectClass.name || ''
            const nameFromDesc = getClassDisplayName(descriptors)

            if(!newName && nameFromDesc) {
              newName = nameFromDesc
            }
            
            updateCreateClass({ descriptors, name: newName })
          }}
          formLabel="Descriptors"
          value={objectClass.descriptors}
        />
        <SelectSpriteInline
          onSelect={(textureId) => {
            updateCreateClass({ graphics: {
              textureId,
              tint: null,
            }})
          }}
          tintSelected={objectClass.graphics.tint}
          onSelectTint={(tint) => {
            updateCreateClass({ graphics: {
              tint
            }})
          }}
          onClearTint={() => {
            updateCreateClass({ graphics: {
              tint: null
            }})
          }}
          descriptors={objectClass.descriptors}
          textureIdSelected={objectClass.graphics.textureId}
        />
      </>}
      {objectClass.type === ZONE_CLASS && 
        <AggregateColorSelect
          selectedColor={objectClass.graphics.tint}
          onSelectColor={(tint) => {
            updateCreateClass({ graphics: {
              tint
            }})
          }}
          onUnselectColor={() => {
            updateCreateClass({ graphics: {
              tint: null
            }})
          }}
      />}
      {objectClass.type !== ZONE_CLASS && objectClass.type !== PLAYER_CLASS && <Unlockable interfaceId={CLASS_LAYER_IID}>
        <SelectLayer formLabel={"Layer"} value={objectClass.graphics.layerId ? [objectClass.graphics.layerId] : [PLAYGROUND_CANVAS_ID]} onChange={(e, value) => {
          const newValue = value[value.length-1]
          if(newValue) updateCreateClass({ graphics: {
            layerId: newValue
          }})
        }}/>
      </Unlockable>}
      {objectClass.isNew && <ClassNameForm></ClassNameForm>}
      {objectClass.isNew && <Unlockable interfaceId={CLASS_LOCK_IID}>
        <Switch
          labels={['Normal', 'Hide from UI unless unlocked']}
          size="small"
          onChange={(e) => {
            updateCreateClass({ interfaceLocked: e.target.checked })          
          }}
          checked={objectClass.interfaceLocked}
         />
      </Unlockable>}
      <Button
        disabled={!!objectClass.error || !objectClass.name.length}
        onClick={() => {
        onComplete(objectClass)
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
  connect(mapStateToProps, { updateCreateClass, closeCreateClassFlow, clearGameFormEditor, openClassNameModal }),
)(CreateClassFlow);
