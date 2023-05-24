import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './StageNameForm.scss';
import { updateCreateStage } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import NameForm from '../../ui/NameForm/NameForm';

const StageNameForm = ({ updateCreateStage, gameModel: { gameModel }, gameFormEditor: { stage } }) => {
  return <NameForm
    initialName={stage.name}
    name={stage.name}
    error={stage.error}
    nameList={Object.keys(gameModel.stages).map((stageId) => {
      return gameModel.stages[stageId].name
    })}
    onUpdateName={(name) => {
      updateCreateStage({ name })
    }}
    onUpdateError={(error) => {
      updateCreateStage({ error })
    }}
  />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateStage })(StageNameForm);
