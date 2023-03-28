/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GameTextures.scss';
import Texture from '../Texture/Texture';

const GameTextures = ({
  textures,
  onClickTexture,
}) => {

  const textureIds = Object.keys(textures)

  return <div className="GameTextures">
    {textureIds.map((textureId) => {
      return <Texture onClick={onClickTexture} key={textureId} textureId={textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  textures: state.gameModel.gameModel.textures,
});

export default compose(
  connect(mapStateToProps, {  }),
)(GameTextures);
