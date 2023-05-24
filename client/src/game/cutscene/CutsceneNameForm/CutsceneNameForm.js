import React from 'react';
import { connect } from 'react-redux';

import './CutsceneNameForm.scss';
import { updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import NameForm from '../../ui/NameForm/NameForm';

const CutsceneNameForm = ({ updateCreateCutscene, gameModel: { gameModel }, gameFormEditor: { cutscene } }) => {
  return <NameForm 
    initialName={cutscene.name}
    name={cutscene.name}
    error={cutscene.error}
    nameList={Object.keys(gameModel.cutscenes).map((cutsceneId) => {
      return gameModel.cutscenes[cutsceneId].name
    })}
    onUpdateName={(name) => {
      updateCreateCutscene({ name })
    }}
    onUpdateError={(error) => {
      updateCreateCutscene({ error })
    }}
  />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateCutscene })(CutsceneNameForm);
