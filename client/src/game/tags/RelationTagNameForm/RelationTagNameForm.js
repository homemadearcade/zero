import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { Alert, TextField } from '@mui/material';
import { updateCreateRelationTag } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';

const RelationTagNameForm = ({ initialName, updateCreateRelationTag, gameModel: { gameModel }, gameFormEditor: { relationTag } }) => {
  const [nameList, setNameList] = useState([])
  const [ignoreName, setIgnoreName] = useState([])

  useEffect(() => {
    const list = []
    Object.keys(gameModel.relationTags).forEach((relationTagId) => {
      list.push(gameModel.relationTags[relationTagId].name)
    })
    setNameList(list)
    setIgnoreName(initialName)
  }, [])

  useEffect(() => {
    testName(relationTag.name)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationTag.name])

  function testName(name) {
    if(!name || !name.length) {
      updateCreateRelationTag({
        error: 'Name must not be empty'
      })
      return false
    }
    if(ignoreName && name === ignoreName) return true
    if(nameList.indexOf(name) >= 0) {
      updateCreateRelationTag({
        error: 'That name is already in use'
      })
      return false
    }

    updateCreateRelationTag({
      error: null
    })
    return true
  }

  function handleChange(e) {
    const newVal = e.target.value
    updateCreateRelationTag({
      name: newVal,
      error: null
    })
  }

  return (
    <div className="RelationTagNameForm">
      <TextField onChange={handleChange} value={relationTag.name} label={"Name"} />
      {relationTag.error && <Alert severity="error">{relationTag.error}</Alert>}
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { updateCreateRelationTag })(RelationTagNameForm);
