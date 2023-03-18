/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './BoundaryRelation.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeBoundaryRelation, updateBoundaryRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';

const BoundaryRelation = ({ closeBoundaryRelation, editGameModel, updateBoundaryRelation, gameFormEditor: { objectClass }}) => {
  function handleClose() {
    closeBoundaryRelation()
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="BoundaryRelation">
      <ClassMemberTitle classId={objectClass.classId} title="Boundary Relation"/>
        <SelectBoundaryEffect
          classId={objectClass.classId}
          formLabel={`What happens when touching the world boundary?`}
          value={objectClass.boundaryRelation ? [objectClass.boundaryRelation] : []}
          onChange={(event, BoundaryRelations) => {
            const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
            updateBoundaryRelation({ boundaryRelation })
        }}/>
        <div className="BoundaryRelation__buttons">
          <Button 
          onClick={() => {
            editGameModel({
              classes: {
                [objectClass.classId] : {
                  boundaryRelation: objectClass.boundaryRelation
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
  connect(mapStateToProps, { updateBoundaryRelation, closeBoundaryRelation, editGameModel }),
)(BoundaryRelation);
