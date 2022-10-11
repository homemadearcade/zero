/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelation.scss';
import CobrowsingModal from '../../app/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateRelation, updateCreateRelation } from '../../store/actions/gameFormEditorActions';
import Typography from '../../app/ui/Typography/Typography';
import Button from '../../app/ui/Button/Button';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../utils/webPageUtils';
import { editGameModel } from '../../store/actions/gameActions';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SelectClass from '../ui/SelectClass/SelectClass';

const CreateRelation = ({ closeCreateRelation, editGameModel, updateCreateRelation, gameFormEditor: { classIdRelationsMenu, relation }}) => {
  function handleClose() {
    closeCreateRelation()
  }

  const [isNewRelation, setIsNewRelation] = useState(null)

  useEffect(() => {
    if(!relation.relationId) {
      updateCreateRelation({ relationId: generateUniqueId() })
      setIsNewRelation(true)
    } else {
      setIsNewRelation(false)
    }
  }, [])

  const handleRelationChange = (prop, value) => {
    relation[prop] = value

    console.log(relation)

    updateCreateRelation(relation)
  }

  const handleEffectChange = (prop) => (value) => {
    relation.effect[prop] = value

    console.log(relation)

    updateCreateRelation(relation)
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="CreateRelation">
        <SelectClass 
          formLabel="With What?"
          value={relation.classId ? [relation.classId] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            handleRelationChange('classId', newClassId)
         }}/>
        <div className="CreateRelation__buttons">
        <Button onClick={() => {
           editGameModel({
            classes: {
              [classIdRelationsMenu]: {
                relations: {
                  [relation.relationId] : {
                    ...relation
                  }
                }
              }
            }
          })
          handleClose()
        }}>
          Save
        </Button>
        <Button onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateRelation, closeCreateRelation, editGameModel }),
)(CreateRelation);
