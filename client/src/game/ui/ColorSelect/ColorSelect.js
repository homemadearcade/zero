/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { v4 as uuidv4 } from 'uuid';
import './ColorSelect.scss';
import { BACKGROUND_LAYER_ID, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_ID } from '../../../constants';
import Button from '../../../app/ui/Button/Button';
import { openCreateColorFlow } from '../../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import CreateColorFlow from '../../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameActions';

const ColorSelect = ({
  game: { gameModel : { colors }},
  layerId,
  onSelectColor,
  openCreateColorFlow,
  editGameModel,
  editorForms: { isCreateColorFlowOpen }
}) => {
  function renderColors(colors) {
    if(!colors) return
    return <div className="ColorSelect">{colors.map(({colorId, color: { hex }}) => {
      return <div onClick={onSelectColor} key={colorId} className="ColorSelect__color" style={{backgroundColor: hex}}></div>
    })}</div>
  }

  console.log(colors)
  console.log(layerId)

  const colorsByLayer = Object.keys(colors).reduce((prev, colorId) => {
    const color = colors[colorId]
    if(!prev[color.layerId]) prev[color.layerId] = []
    prev[color.layerId].push({ colorId, color })
    return prev
  }, {})

  function renderBody() {
    if(layerId === BACKGROUND_LAYER_ID) {
      return renderColors(colorsByLayer[BACKGROUND_LAYER_ID])
    }
    if(layerId === PLAYGROUND_LAYER_ID) {
      return renderColors(colorsByLayer[PLAYGROUND_LAYER_ID])
    }
    if(layerId === OVERHEAD_LAYER_ID) {
      return renderColors(colorsByLayer[OVERHEAD_LAYER_ID])
    }
  }

  return <>
    {renderBody()}
    <Button onClick={() => {
      openCreateColorFlow(layerId)
    }}>
      +
    </Button>
    {isCreateColorFlowOpen && <CreateColorFlow
      onComplete={(color) => {
        const colorId = uuidv4()
        editGameModel({
          colors: {
            [colorId]: color
          }
        })
      }}
    />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel }),
)(ColorSelect);
