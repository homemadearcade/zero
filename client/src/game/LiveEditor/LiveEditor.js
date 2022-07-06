import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';
import { closeLiveEditor } from '../../store/actions/editorActions';

import './LiveEditor.scss'
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import { Button } from '@mui/material';

const LiveEditor = ({ closeLiveEditor, game: { gameModel }, editor: { editorState: { classSelectedIdLiveEditor } },  editGameModel }) => {
  const classSelected = gameModel.classes[classSelectedIdLiveEditor]

  return (
    <div className="LiveEditor">
      Editing Class:<br/> 
      {classSelectedIdLiveEditor}
      <div className="LiveEditor__close"><Button onClick={closeLiveEditor}><i className="fas fa-close"/></Button></div>
      <ButtonGroup
        title="Speed"
        options={[.01, 0.5, 1, 5, 20, 100, 500]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { speed: value }}})        
        }}
        initialOption="normal"
      />
      <ButtonGroup
        title="Mass"
        options={[.01, 0.5, 1, 5, 20, 100, 500]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { mass: value }}})       
        }}
        initialOption={classSelected.mass}
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
        options={[0, .25, .5, .75, 1]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { friction: value }}})        
        }}
        initialOption={classSelected.friction}
      />
      <ButtonGroup
        title="Friction (Air)"
        options={[0, .25, .5, .75, 1]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { frictionAir: value }}})        
        }}
        initialOption={classSelected.frictionAir}
      />
       <ButtonGroup
        title="Friction (Static)"
        options={[0, 10, 100, 1000]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { frictionStatic: value }}})        
        }}
        initialOption={classSelected.frictionStatic}
      />
      <ButtonGroup
        title="Density"
        options={[.01, 0.5, 1, 5, 20, 100, 500]}
        onSelectOption={(value) => {
          editGameModel({ classes: { [classSelectedIdLiveEditor]: { density: value }}})        
        }}
        initialOption={classSelected.density}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel, closeLiveEditor })(LiveEditor);
