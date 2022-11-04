import React, { useEffect, useRef, useState } from 'react';

import './LightupImage.scss';

const LightupImage = ({ src, className }) => {
  return <img className={"LightupImage " + className} src={src}></img>
};

export default LightupImage
