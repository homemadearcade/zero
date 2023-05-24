import React from 'react';
import { connect } from 'react-redux';

import './EntityNameForm.scss';
import { updateCreateEntity } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import NameForm from '../../ui/NameForm/NameForm';

const EntityNameForm = ({ updateCreateEntity, gameModel: { gameModel }, gameFormEditor: { entityModel } }) => {
  return <NameForm
    initialName={entityModel.name}
    name={entityModel.name}
    error={entityModel.error}
    nameList={Object.keys(gameModel.entityModels).map((entityModelId) => {
      const entityModel = gameModel.entityModels[entityModelId]
      return entityModel.name
    })}
    onUpdateName={(name) => {
      updateCreateEntity({ name })
    }}
    onUpdateError={(error) => {
      updateCreateEntity({ error })
    }}
  />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateEntity })(EntityNameForm);
