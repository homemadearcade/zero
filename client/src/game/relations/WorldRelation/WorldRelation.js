/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './WorldRelation.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeWorldRelation, updateWorldRelation } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../components/ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/gameActions';
import ClassMemberTitle from '../../class/ClassMemberTitle/ClassMemberTitle';
import SelectWorldBoundaryEffect from '../../ui/SelectWorldBoundaryEffect/SelectWorldBoundaryEffect';

const WorldRelation = ({ closeWorldRelation, editGameModel, updateWorldRelation, gameFormEditor: { objectClass }}) => {
  function handleClose() {
    closeWorldRelation()
  }

  return <CobrowsingModal open={true} onClose={handleClose}>
    <div className="WorldRelation">
      <ClassMemberTitle classId={objectClass.classId} title="Boundary Relation"/>
        <SelectWorldBoundaryEffect
          classId={objectClass.classId}
          formLabel={`What happens when touching the world boundary?`}
          value={objectClass.worldBoundaryRelation ? [objectClass.worldBoundaryRelation] : []}
          onChange={(event, worldRelations) => {
            const worldBoundaryRelation = worldRelations[worldRelations.length-1]
            updateWorldRelation({ worldBoundaryRelation })
        }}/>
        <div className="WorldRelation__buttons">
          <Button 
          onClick={() => {
            editGameModel({
              classes: {
                [objectClass.classId] : {
                  worldBoundaryRelation: objectClass.worldBoundaryRelation
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
  connect(mapStateToProps, { updateWorldRelation, closeWorldRelation, editGameModel }),
)(WorldRelation);
