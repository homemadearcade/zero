import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { updateFormEditorGameModel } from '../../../store/actions/game/gameFormEditorActions';
import SelectPlayScope from '../../../game/ui/SelectPlayScope/SelectPlayScope';
import { editGameModel } from '../../../store/actions/game/gameModelActions';

const GamePrivacyForm = ({ 
  gameFormEditor: { gameModelFormEditor }, 
  gameModel: { gameModel },
  updateFormEditorGameModel,
  editGameModel
}) => {

  useEffect(() => {
    updateFormEditorGameModel({
      playScope: gameModel.playScope,
      editScope: gameModel.editScope,
    })

    return () => {
      editGameModel({
        playScope: gameModelFormEditor.playScope,
        editScope: gameModelFormEditor.editScope,
      })
    }
  }, [])

  if(!gameModelFormEditor) return

  return <>
    <SelectPlayScope formLabel="Who can play this game?" onChange={(value) => {
    updateFormEditorGameModel({
      playScope: value
    })
  }} value={gameModelFormEditor.playScope} />
  {/* <div>
    <Controller
      name={"editScope"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectEditScope formLabel="Who can edit this game?" onChange={onChange} value={value} />
      )}
    />
  </div> */}
  </>
};

const mapStateToProps = (state) => ({
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { updateFormEditorGameModel, editGameModel })(GamePrivacyForm);
