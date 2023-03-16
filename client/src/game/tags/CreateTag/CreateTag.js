/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateTag.scss';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import Button from '../../../ui/Button/Button';
import { closeCreateTag, updateCreateTag } from '../../../store/actions/gameFormEditorActions';
import SelectClassType from '../../ui/SelectClassType/SelectClassType';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_TAG_COLOR_IID } from '../../../constants/interfaceIds';
import TagNameForm from '../TagNameForm/TagNameForm';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import { TAG_ID_PREFIX } from '../../constants';
import { generateUniqueId } from '../../../utils/webPageUtils';

const CreateTag = ({ updateCreateTag, closeCreateTag, editGameModel, gameFormEditor: { tag }, gameModel: { gameModel } }) => {

  useEffect(() => {
    if(!tag.tagId) {
      updateCreateTag({ tagId: TAG_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  function handleClose() {
    closeCreateTag()
  }

  function handleSubmit() {
    editGameModel({
      tags: {
        [tag.tagId] : {
          ...tag,
        }
      }
    })
    handleClose()
  }

  return <CobrowsingModal open onClose={handleClose}>
    <div className="CreateTag">
      <TagNameForm
        initialName={tag.name}
      />
        <AggregateColorSelect
          selectedColor={tag.color}
          onSelectColor={(color) => {
            updateCreateTag({
              color
            })
          }}
          onUnselectColor={() => {
            updateCreateTag({
              color: null
            })
          }}
      />
      <Button disabled={tag.error || !tag.color || tag.isAutomaticTag} type="submit" onClick={handleSubmit}>Save</Button>
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor
})

export default compose(
  connect(mapStateToProps, { closeCreateTag, editGameModel, updateCreateTag }),
)(CreateTag);
