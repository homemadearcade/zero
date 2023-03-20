import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './ClassNameForm.scss';
import { Alert, TextField } from '@mui/material';
import { updateCreateClass } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import IconButton from '../../../ui/IconButton/IconButton';

const ClassNameForm = ({ isEditingInitially, initialName, updateCreateClass, gameModel: { gameModel }, gameFormEditor: { entityClass } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])
  const [isEditing, setIsEditing] = useState(isEditingInitially)
  const [isHovering, setIsHovering] = useState(false)

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

  if(isEditing) {
    return (
      <div className="ClassNameForm">
        <TextField onChange={handleChange} label="Name" value={entityClass.name} />
        {entityClass.error && <Alert severity="error">{entityClass.error}</Alert>}
        {<IconButton icon="faCheck" onClick={() => {
          setIsEditing(false)
        }}></IconButton>}
      </div>
    );
  } else {
    return <div
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
    >
        <Typography variant="h4">
        {entityClass.name}
        {isHovering && <IconButton icon="faPen" onClick={() => {
          setIsEditing(true)
        }}></IconButton>}
      </Typography>
    </div>
  }
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateClass })(ClassNameForm);
