import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './EntityNameForm.scss';
import { updateCreateEntity } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import IconButton from '../../../ui/IconButton/IconButton';
import Alert from '../../../ui/Alert/Alert';
import TextField from '../../../ui/TextField/TextField';

const EntityNameForm = ({ isEditingInitially, initialName, updateCreateEntity, gameModel: { gameModel }, gameFormEditor: { entityModel } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])
  const [isEditing, setIsEditing] = useState(isEditingInitially)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const list = []
    Object.keys(gameModel.entityModels).forEach((entityModelId) => {
      list.push(gameModel.entityModels[entityModelId].name)
    })
    setNameList(list)
    setIgnoreName(initialName)
  }, [])

  useEffect(() => {
    testName(entityModel.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityModel.name])

  function testName(name) {
    if(!name || !name.length) {
      updateCreateEntity({
        error: 'Name must not be empty'
      })
      return false
    }
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      updateCreateEntity({
        error: 'That name is already in use'
      })
      return false
    }

    updateCreateEntity({
      error: null
    })
    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    updateCreateEntity({
      name: newVal,
      error: null
    })
  }
  

  if(isEditing) {
    return (
        <div className="EntityNameForm">
          <TextField onChange={handleChange} label="Name" value={entityModel.name} />
          {entityModel.error && <Alert severity="error">{entityModel.error}</Alert>}
          {!isEditingInitially && <IconButton icon="faCheck" onClick={() => {
            setIsEditing(false)
        }}></IconButton>}
        </div>
       );
  } else {
    return <div
      className="EntityNameForm"
      onMouseEnter={() => {
        setIsHovering(true)
      }}
      onMouseLeave={() => {
        setIsHovering(false)
      }}
    >
        <Typography variant="h4">
        {entityModel.name}
      </Typography>
      {isHovering && <IconButton icon="faPen" onClick={() => {
        setIsEditing(true)
      }}></IconButton>}
    </div>
  }
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateEntity })(EntityNameForm);
