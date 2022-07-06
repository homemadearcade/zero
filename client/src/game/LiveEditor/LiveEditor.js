import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import ButtonGroup from '../ButtonGroup/ButtonGroup';

const LiveEditor = ({ closeLiveEditor, game: { gameModel }, editor: { editorState: { objectSelectedIdLiveEditor } },  editGameModel }) => {
  return (
    <div className="LiveEditor">
      <button className="LiveEditor__close" onClick={closeLiveEditor}><i className="fas fa-close"/></button>
      <ButtonGroup
        title="Speed"
        options={['snail', 'slow', 'normal', 'fast', 'cheetah']}
        onSelectOption={(value) => {
          console.log('selected value', value);

          gameModel.objects = gameModel.objects.map((object) => {
            if(object.id === objectSelectedIdLiveEditor) {
              object.angularVelocity = object.angularVelocity += 100
            }

            return object
          })

          editGameModel(gameModel)
        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Mass"
        options={['bricks', 'heavy', 'normal', 'light', 'feather']}
        onSelectOption={() => {

        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Bounce"
        options={['bricks', 'heavy', 'normal', 'light', 'feather']}
        onSelectOption={(value) => {
          gameModel.objects = gameModel.objects.map((object) => {
            if(object.id === objectSelectedIdLiveEditor) {
              object.bounciness = 1
            }
            return object
          })

          editGameModel(gameModel)
        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Friction"
        options={['bricks', 'heavy', 'normal', 'light', 'feather']}
        onSelectOption={() => {

        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Friction (Air)"
        options={['bricks', 'heavy', 'normal', 'light', 'feather']}
        onSelectOption={() => {

        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Density"
        options={['bricks', 'heavy', 'normal', 'light', 'feather']}
        onSelectOption={() => {

        }}
        initialOption="normal"
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
