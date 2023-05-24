/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateRelationTag.scss';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import { closeCreateRelationTag, updateCreateRelationTag } from '../../../store/actions/game/gameFormEditorActions';
import RelationTagNameForm from '../RelationTagNameForm/RelationTagNameForm';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { RELATION_TAG_DID } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';
import ReadOnlyWarning from '../../ui/ReadOnlyWarning/ReadOnlyWarning';
import TextField from '../../../ui/TextField/TextField';

const CreateRelationTag = ({ updateCreateRelationTag, closeCreateRelationTag, editGameModel, gameFormEditor: { relationTag }, gameModel: { gameModel } }) => {

  const defaultRelationTagName = 'Relation Tag #' + (Object.keys(gameModel.relationTags).length + 1).toString()
  useEffect(() => {
    if(!relationTag.relationTagId) {
      updateCreateRelationTag({ 
        relationTagId: RELATION_TAG_DID+generateUniqueId(), isNew: true,
        name: defaultRelationTagName
       })
    }
  }, [])

  function handleClose() {
    closeCreateRelationTag()
  }

  function handleSubmit() {
    editGameModel({
      relationTags: {
        [relationTag.relationTagId] : {
          ...relationTag,
        }
      }
    })
    handleClose()
  }

  function renderButtons() {
    if(relationTag.isReadOnly) return <ReadOnlyWarning text={'This Relation Tag is Read only'} />
    return <>
      <Button disabled={!relationTag.textureTint || relationTag.isReadOnly} type="submit" onClick={handleSubmit}>
        {relationTag.isNew ? 'Create' : 'Save'}
      </Button>
      <Button onClick={handleClose}>Cancel</Button>
    </>
  }

  return <CobrowsingDialog open>
    <div className="CreateRelationTag">
      <RelationTagNameForm
        initialName={relationTag.name || defaultRelationTagName}
      />
        <AggregateColorSelect
          selectedColor={relationTag.textureTint}
          onSelectColor={(textureTint) => {
            updateCreateRelationTag({
              textureTint
            })
          }}
          onUnselectColor={() => {
            updateCreateRelationTag({
              textureTint: null
            })
          }}
      />
      <TextField multiline fullWidth minRows={4} onChange={(event) => {
        updateCreateRelationTag({
          description: event.target.value
        })
      }} value={relationTag.description} label={"Description"} />

      {renderButtons()}
    </div>
  </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeCreateRelationTag, editGameModel, updateCreateRelationTag }),
)(CreateRelationTag);
