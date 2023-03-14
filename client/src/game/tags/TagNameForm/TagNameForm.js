import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Alert, TextField } from '@mui/material';
import { updateCreateTag } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const TagNameForm = ({ initialName, updateCreateTag, gameModel: { gameModel }, gameFormEditor: { tag } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])

  useEffect(() => {
    const list = []
    Object.keys(gameModel.tags).forEach((tagId) => {
      list.push(gameModel.tags[tagId].name)
    })
    setNameList(list)
    setIgnoreName(initialName)
  }, [])

  useEffect(() => {
    testName(tag.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag.name])

  function testName(name) {
    if(!name || !name.length) {
      updateCreateTag({
        error: 'Name must not be empty'
      })
      return false
    }
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      updateCreateTag({
        error: 'That name is already in use'
      })
      return false
    }

    updateCreateTag({
      error: null
    })
    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    updateCreateTag({
      name: newVal,
      error: null
    })
  }

  return (
    <div className="TagNameForm">
      <TextField onChange={handleChange} value={tag.name} label={"Name"} />
      {tag.error && <Alert severity="error">{tag.error}</Alert>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateTag })(TagNameForm);
