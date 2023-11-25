/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './RecentTextures.scss';
import Texture from '../Texture/Texture';
import { sortByLastSelectedDate } from '../../../utils';

const RecentTextures = ({
  onClickTexture,
  gameModel: { gameModel }
}) => {

  const textureIds = []

  Object.keys(gameModel.brushes).
  filter((brushId) => {
    const brush = gameModel.brushes[brushId]
    return !!brush.textureId
  }).
  sort(sortByLastSelectedDate(gameModel.brushes)).
  slice(0, 14).
  forEach((brushId) => {
    const brush = gameModel.brushes[brushId]
    textureIds.push(brush.textureId)
  })

  Object.keys(gameModel.entityModels).
  filter((entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]
    return !!entityModel.graphics.textureId
  }).
  sort(sortByLastSelectedDate(gameModel.entityModels)).
  slice(0, 14).
  forEach((entityModelId) => {
    const entityModel = gameModel.entityModels[entityModelId]
    textureIds.push(entityModel.graphics.textureId)
  })

  return <div className="RecentTextures">
    {textureIds.map((textureId) => {
      return <Texture key={textureId} onClick={onClickTexture} textureId={textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel
});

export default compose(
  connect(mapStateToProps, {  }),
)(RecentTextures);
