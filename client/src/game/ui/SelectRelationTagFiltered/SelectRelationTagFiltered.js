/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectRelationTagFiltered.scss';
import SelectRelationTag from '../SelectRelationTag/SelectRelationTag';

const SelectRelationTagFiltered = ({ interfaceId, relationTagIID, onChange, disabled, entityModel, formLabel, gameModel: { gameModel } }) => {
  return <SelectRelationTag
      disabled={disabled}
      interfaceId={interfaceId}
      formLabel={formLabel}
      removeEntityTags value={entityModel.relationTags ? Object.keys(entityModel.relationTags).filter((relationTagId) => {
        const entityModelRelationTag = entityModel.relationTags[relationTagId]
        const isTruthy = !!entityModelRelationTag 

        if(!isTruthy) return false

        const isNotReadOnly = !entityModelRelationTag.isReadOnly

        if(relationTagIID) {
          const relationTag = gameModel.relationTags[relationTagId]
          const isMatchingRelationTagIID = relationTag.relationTagIID === relationTagIID
          return isNotReadOnly && isMatchingRelationTagIID
        }

        return isNotReadOnly
      }) : []} onChange={(event, relationTags) => {

        const currentTags = Object.keys(entityModel.relationTags).filter((relationTagId) => !!entityModel.relationTags[relationTagId]).reduce((prev, relationTagId) => {
          const relationTag = entityModel.relationTags[relationTagId]
          // this purely helps with the UI so that it doesnt APPEAR deleted at the end.
          // these relationTags will always come back through the game model update event
          if(relationTag.isReadOnly) {
            prev[relationTagId] = {
              isReadOnly: true,
            }
          } else {
            prev[relationTagId] = null
          }
          return prev
        }, {})

        const newTags = relationTags.reduce((prev, relationTagId) => {
          prev[relationTagId] = {}
          return prev
        }, currentTags)

        onChange({
          relationTags: newTags
        })
      }}
  />
}

const mapStateToProps = (state) => {
  return {
    gameModel: state.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectRelationTagFiltered);
