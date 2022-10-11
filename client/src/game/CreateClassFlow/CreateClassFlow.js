/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateClassFlow.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import SelectDescriptors from '..//ui/SelectDescriptors/SelectDescriptors';
import { clearGameFormEditor, closeCreateClassFlow, updateCreateClass } from '../../store/actions/gameFormEditorActions';
import SelectSpriteInline from '../ui/SelectSpriteInline/SelectSpriteInline';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import ClassNameForm from '../ui/ClassNameForm/ClassNameForm';
import { getClassDisplayName } from '../../utils/gameUtils';
import ClassMemberTitle from '../ClassMemberTitle/ClassMemberTitle';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';
import { classTypeToDisplayName } from '../../defaultData/class';
import Switch from '../../app/ui/Switch/Switch';
import AggregateColorSelect from '../AggregateColorSelect/AggregateColorSelect';
import { generateUniqueId } from '../../utils/webPageUtils';

const CreateClassFlow = ({ onComplete, clearGameFormEditor, updateCreateClass, closeCreateClassFlow, gameFormEditor: { class: objectClass } }) => {
  const [isNewClass, setIsNewClass] = useState(null)

  function handleClose() {
    closeCreateClassFlow()
    clearGameFormEditor()
  }
  
  useEffect(() => {
    if(!objectClass.classId) {
      updateCreateClass({ classId: generateUniqueId() })
      setIsNewClass(true)
    } else {
      setIsNewClass(false)
    }
  }, [])

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateClassFlow">
      {isNewClass === true && <Typography component="h2" variant="h2">New {classTypeToDisplayName[objectClass.type]}</Typography>}
      {isNewClass === false && <ClassMemberTitle classId={objectClass.classId} title="Graphics"></ClassMemberTitle>}
      <Unlockable interfaceId="advanced/invisibleClass adminOnly">
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
      </>}
      {objectClass.graphics.invisible && 
        <AggregateColorSelect
          canvasId="common"
          selectedColor={objectClass.graphics.tint}
          onSelectColor={(tint) => {
            updateCreateClass({ graphics: {
              tint
            }})
          }}
          onClearcoloronSelectColor={() => {
            updateCreateClass({ graphics: {
              tint: null
            }})
          }}
        />
      }
      <ClassNameForm/>
      {isNewClass && <Unlockable interfaceId="advanced/interfaceLockedClass adminOnly">
        <Switch
          labels={['Normal', 'Interface Locked']}
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
  connect(mapStateToProps, { updateCreateClass, closeCreateClassFlow, clearGameFormEditor }),
)(CreateClassFlow);
