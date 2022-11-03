/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './MySprites.scss';
import Sprite from '../Sprite/Sprite';

const MySprites = ({
  awsImages,
  onClickSprite
}) => {

  const textureIds = Object.keys(awsImages).map((awsId) => {
    return awsImages[awsId].url
  })

  return <div className="MySprites">
    {textureIds.map((textureId) => {
      return <Sprite onClick={onClickSprite} key={textureId} textureId={textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  awsImages: state.game.gameModel.awsImages
});

export default compose(
  connect(mapStateToProps, {  }),
)(MySprites);
