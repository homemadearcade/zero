import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './CutsceneNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { updateCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const CutsceneNameForm = ({ initialName, updateCreateCutscene, gameModel: { gameModel }, gameFormEditor: { cutscene } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])

  useEffect(() => {
    const list = []
    Object.keys(gameModel.cutscenes).forEach((cutsceneId) => {
      list.push(gameModel.cutscenes[cutsceneId].name)
    })
    setIgnoreName(initialName)
    setNameList(list)
  }, [])

  useEffect(() => {
    testName(cutscene.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutscene.name])

  function testName(name) {
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      updateCreateCutscene({
        error: 'That name is already in use'
      })
      return false
    }

    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    updateCreateCutscene({
      name: newVal,
      error: null
    })
  }

  return (
    <div className="CutsceneNameForm">
      <TextField onChange={handleChange} value={cutscene.name} label={"Name"} />
      {cutscene.error && <Alert severity="error">{cutscene.error}</Alert>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateCutscene })(CutsceneNameForm);
