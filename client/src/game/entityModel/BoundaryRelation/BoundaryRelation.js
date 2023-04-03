/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './BoundaryRelation.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeBoundaryRelation, updateBoundaryRelation } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import EntityMemberTitle from '../../entityModel/EntityMemberTitle/EntityMemberTitle';
import SelectBoundaryEffect from '../../ui/SelectBoundaryEffect/SelectBoundaryEffect';

const BoundaryRelation = ({ closeBoundaryRelation, editGameModel, updateBoundaryRelation, gameFormEditor: { entityModel }}) => {
  function handleClose() {
    closeBoundaryRelation()
  }

  return <CobrowsingDialog open={true} onClose={handleClose}>
    <div className="BoundaryRelation">
      <EntityMemberTitle entityModelId={entityModel.entityModelId} title="Boundary Relation"/>
        <SelectBoundaryEffect
          entityModelId={entityModel.entityModelId}
          formLabel={`What happens when touching the world boundary?`}
          value={entityModel.boundaryRelation ? [entityModel.boundaryRelation] : []}
          onChange={(event, BoundaryRelations) => {
            const boundaryRelation = BoundaryRelations[BoundaryRelations.length-1]
            updateBoundaryRelation({ boundaryRelation })
        }}/>
        <div className="BoundaryRelation__buttons">
          <Button 
          onClick={() => {
            editGameModel({
              entityModels: {
                [entityModel.entityModelId] : {
                  boundaryRelation: entityModel.boundaryRelation
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
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateBoundaryRelation, closeBoundaryRelation, editGameModel }),
)(BoundaryRelation);
