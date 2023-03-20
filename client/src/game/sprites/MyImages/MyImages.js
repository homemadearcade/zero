/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './MyImages.scss';
import Texture from '../Texture/Texture';

const MyImages = ({
  canvasImages,
  onClickTexture,
}) => {

  const textureIds = Object.keys(canvasImages)

  return <div className="MyImages">
    {textureIds.map((textureId) => {
      return <Texture onClick={onClickTexture} key={textureId} textureId={textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  canvasImages: state.gameModel.gameModel.canvasImages,
});

export default compose(
  connect(mapStateToProps, {  }),
)(MyImages);
