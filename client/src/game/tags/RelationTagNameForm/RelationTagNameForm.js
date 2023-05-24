import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { updateCreateRelationTag } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import NameForm from '../../ui/NameForm/NameForm';

const RelationTagNameForm = ({ initialName, updateCreateRelationTag, gameModel: { gameModel }, gameFormEditor: { relationTag } }) => {
  return <NameForm
    initialName={relationTag.name}
    name={relationTag.name}
    error={relationTag.error}
    nameList={Object.keys(gameModel.relationTags).map((relationTagId) => {
      return gameModel.relationTags[relationTagId].name
    })}
    onUpdateName={(name) => {
      updateCreateRelationTag({ name })
    }}
    onUpdateError={(error) => {
      updateCreateRelationTag({ error })
    }}
  />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateRelationTag })(RelationTagNameForm);
