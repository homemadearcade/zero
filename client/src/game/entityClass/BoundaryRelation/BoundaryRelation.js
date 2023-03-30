/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './BoundaryRelation.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeBoundaryRelation, updateBoundaryRelation } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import ClassMemberTitle from '../../entityClass/ClassMemberTitle/ClassMemberTitle';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';

const BoundaryRelation = ({ closeBoundaryRelation, editGameModel, updateBoundaryRelation, gameFormEditor: { entityClass }}) => {
  function handleClose() {
    closeBoundaryRelation()
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="BoundaryRelation">
      <ClassMemberTitle entityClassId={entityClass.entityClassId} title="Boundary Relation"/>
        <SelectBoundaryEffect
          entityClassId={entityClass.entityClassId}
          formLabel={`What happens when touching the world boundary?`}
          value={entityClass.boundaryRelation ? [entityClass.boundaryRelation] : []}
          onChange={(event, BoundaryRelations) => {
            const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
            updateBoundaryRelation({ boundaryRelation })
        }}/>
        <div className="BoundaryRelation__buttons">
          <Button 
          onClick={() => {
            editGameModel({
              entityClasses: {
                [entityClass.entityClassId] : {
                  boundaryRelation: entityClass.boundaryRelation
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
