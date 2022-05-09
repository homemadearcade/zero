import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import ButtonGroup from '../ButtonGroup/ButtonGroup';

const LiveEditor = ({ closeLiveEditor, editor: { editorState: { objectSelectedId } }}) => {
  return (
    <div className="LiveEditor">
      <button className="LiveEditor__close" onClick={closeLiveEditor}><i className="fas fa-close"/></button>
      <ButtonGroup
        title="Speed"
        options={['snail', 'slow', 'normal', 'fast', 'cheetah']}
        onSelectOption={() => {

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
        onSelectOption={() => {

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
  editor: state.editor
});

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
