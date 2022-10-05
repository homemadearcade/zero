/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateClassFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '..//ui/SelectDescriptors/SelectDescriptors';
import { clearEditorForms, closeCreateClassFlow, updateCreateClass } from '../../store/actions/editorFormsActions';
import SelectSpriteInline from '../ui/SelectSpriteInline/SelectSpriteInline';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import ClassNameForm from '../ui/ClassNameForm/ClassNameForm';
import { getClassDisplayName } from '../../utils/gameUtils';
import { v4 as uuidv4 } from 'uuid';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';

const CreateClassFlow = ({ onComplete, clearEditorForms, updateCreateClass, closeCreateClassFlow, editorForms: { class: objectClass } }) => {
  const [isNewClass, setIsNewClass] = useState(null)

  function handleClose() {
    closeCreateClassFlow()
    clearEditorForms()
  }
  
  useEffect(() => {
    if(!objectClass.classId) {
      updateCreateClass({ classId: uuidv4() })
      setIsNewClass(true)
    } else {
      setIsNewClass(false)
    }
  }, [])

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateClassFlow">
      {isNewClass === true && <Typography component="h2" variant="h2">New {objectClass.type.charAt(0).toUpperCase() + objectClass.type.slice(1)}</Typography>}
      {isNewClass === false && <ClassMemberTitle classId={objectClass.classId} title="Graphics"></ClassMemberTitle>}
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
            textureId 
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
      <ClassNameForm/>
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
  editorForms: state.editorForms,
})

export default compose(
  connect(mapStateToProps, { updateCreateClass, closeCreateClassFlow, clearEditorForms }),
)(CreateClassFlow);
