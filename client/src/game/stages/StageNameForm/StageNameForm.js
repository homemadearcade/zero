import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './StageNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { updateCreateStageModal } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const StageNameForm = ({ initialName, updateCreateStageModal, gameModel: { gameModel }, gameFormEditor: { stage } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])

  useEffect(() => {
    const list = []
    Object.keys(gameModel.stages).forEach((stageId) => {
      list.push(gameModel.stages[stageId].name)
    })
    setNameList(list)
    setIgnoreName(initialName)
  }, [])

  useEffect(() => {
    testName(stage.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage.name])

  function testName(name) {
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      updateCreateStageModal({
        error: 'That name is already in use'
      })
      return false
    }

    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    updateCreateStageModal({
      name: newVal,
      error: null
    })
  }

  return (
    <div className="StageNameForm">
      <TextField onChange={handleChange} value={stage.name} label={"Name"} />
      {stage.error && <Alert severity="error">{stage.error}</Alert>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateStageModal })(StageNameForm);
