/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './MySprites.scss';
import Sprite from '../Sprite/Sprite';

const MySprites = ({
  textures,
  onClickSprite,
}) => {

  const textureIds = Object.keys(textures)

  return <div className="MySprites">
    {textureIds.map((textureId) => {
      return <Sprite onClick={onClickSprite} key={textureId} textureId={textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  textures: state.gameModel.gameModel.textures,
});

export default compose(
  connect(mapStateToProps, {  }),
)(MySprites);
