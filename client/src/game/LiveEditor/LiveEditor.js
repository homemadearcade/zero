import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import ButtonGroup from '../ButtonGroup/ButtonGroup';

const LiveEditor = ({ closeLiveEditor, game: { gameModel }, editor: { editorState: { classSelectedIdLiveEditor } },  editGameModel }) => {
  const classSelected = gameModel.classes[classSelectedIdLiveEditor]

  return (
    <div className="LiveEditor">
      <button className="LiveEditor__close" onClick={closeLiveEditor}><i className="fas fa-close"/></button>
      <ButtonGroup
        title="Speed"
        options={['snail', 'slow', 'normal', 'fast', 'cheetah']}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { speed: 100 }}})        
        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Mass"
        options={['bricks', 'heavy', 'normal', 'light', 'feather']}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { mass: 100 }}})       
        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Bounce"
        options={[0, .25, .5, .75, 1]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { bounciness: value }}})        
        }}
        initialOption={classSelected.bounciness}
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
