/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TextureStage.scss';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Texture from '../Texture/Texture';
import IconButton from '../../../ui/IconButton/IconButton';
import Icon from '../../../ui/Icon/Icon';

const TextureStage = ({
  textureId,
  textureTint,
  children,
  overlayIcon,
  onClickIcon
}) => {
  const [isHoverTexture, setIsHoveringTexture] = useState(false)

  function renderBody() {
    if(!textureId && !textureTint && !(isHoverTexture && overlayIcon)) {
      return <div className="TextureStage__missing">
        <Icon icon="faImage"/>
      </div>
    }
    return <>
      <Texture textureTint={textureTint} textureId={textureId}/>
      {children}
    </>
  }

  return <div className="TextureStage__texture"
     onMouseEnter={() => {
      setIsHoveringTexture(true)
    }}
    onMouseLeave={() => {
      setIsHoveringTexture(false)
    }}
  > 
    {renderBody()}
    {overlayIcon && isHoverTexture && <div className='TextureStage__overlay'>
      <IconButton onClick={onClickIcon} icon={overlayIcon}> </IconButton>
    </div>}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {

});

export default compose(
  connect(mapStateToProps, {  }),
)(TextureStage);
