import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { addLobby } from '../../../store/actions/lobbyActions';

import './ClassNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { addGame } from '../../../store/actions/gameActions';
import { updateCreateClass } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const ClassNameForm = ({ updateCreateClass, game: { gameModel }, gameFormEditor: { class: objectClass } }) => {
  const [nameList, setNameList] = useState([])

  useEffect(() => {
    const list = []
    Object.keys(gameModel.classes).forEach((classId) => {
      list.push(gameModel.classes[classId].name)
    })
    setNameList(list)
  }, [])

  useEffect(() => {
    testName(objectClass.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectClass.name])

  function testName(name) {
    if(nameList.indexOf(name) >= 0) {
      updateCreateClass({
        error: 'That name is already in use'
      })
      return false
    }

    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    updateCreateClass({
      name: newVal,
      error: null
    })
  }

  return (
    <div className="ClassNameForm">
      <TextField onChange={handleChange} value={objectClass.name} label={"Name"} />
      {objectClass.error && <Alert severity="error">{objectClass.error}</Alert>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateClass, addLobby, addGame })(ClassNameForm);
