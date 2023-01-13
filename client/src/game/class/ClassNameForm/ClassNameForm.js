import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './ClassNameForm.scss';
import { TextField } from '@mui/material';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const ClassNameForm = ({ gameModel: { gameModel }, objectClass, onChangeName, onError }) => {
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
      onError('That name is already in use')
      return false
    }

    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    onChangeName(newVal)
  }

  return (
    <div className="ClassNameForm">
      <TextField onChange={handleChange} value={objectClass.name} label={"Name"} />
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { })(ClassNameForm);
