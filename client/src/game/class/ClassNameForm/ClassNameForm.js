import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './ClassNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { updateCreateClass } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const ClassNameForm = ({ initialName, updateCreateClass, gameModel: { gameModel }, gameFormEditor: { entityClass } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])



  useEffect(() => {
    const list = []
    Object.keys(gameModel.entityClasses).forEach((entityClassId) => {
      list.push(gameModel.entityClasses[entityClassId].name)
    })
    setNameList(list)
    setIgnoreName(initialName)
  }, [])

  useEffect(() => {
    testName(entityClass.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityClass.name])

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
      <TextField onChange={handleChange} value={entityClass.name} label={"Name"} />
      {entityClass.error && <Alert severity="error">{entityClass.error}</Alert>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateClass })(ClassNameForm);
