import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './ClassNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { updateCreateClass } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const ClassNameForm = ({ initialName, updateCreateClass, gameModel: { gameModel }, gameFormEditor: { objectClass } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])



  useEffect(() => {
    const list = []
    Object.keys(gameModel.classes).forEach((classId) => {
      list.push(gameModel.classes[classId].name)
    })
    setNameList(list)
    setIgnoreName(initialName)
  }, [])

  useEffect(() => {
    testName(objectClass.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objectClass.name])

  function testName(name) {
    if(!name || !name.length) {
      updateCreateClass({
        error: 'Name must not be empty'
      })
      return false
    }
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      updateCreateClass({
        error: 'That name is already in use'
      })
      return false
    }

    updateCreateClass({
      error: null
    })
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
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateClass })(ClassNameForm);
