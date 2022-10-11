import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/lobbyActions';

import './CutsceneNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { addGame } from '../../../store/actions/gameActions';
import { updateCreateCutscene } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const CutsceneNameForm = ({ updateCreateCutscene, game: { gameModel }, gameFormEditor: { cutscene } }) => {
  const [nameList, setNameList] = useState([])

  useEffect(() => {
    const list = []
    Object.keys(gameModel.cutscenes).forEach((cutsceneId) => {
      list.push(gameModel.cutscenes[cutsceneId].name)
    })
    setNameList(list)
  }, [])

  useEffect(() => {
    testName(cutscene.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cutscene.name])

  function testName(name) {
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
  game: state.game,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateCutscene, addLobby, addGame })(CutsceneNameForm);
