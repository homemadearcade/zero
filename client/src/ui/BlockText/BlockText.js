import React, { useEffect, useRef, useState } from 'react';
import Link from '../Link/Link';

import './BlockText.scss';

const BlockText = ({ text, seeMoreLink, className = "" }) => {
  return <div className={"BlockText " + className}>
    <div className='BlockText__body'>
      {text}
      {seeMoreLink && <Link className="BlockText__read-more" newTab href={seeMoreLink}>Read more..</Link>}
    </div>
  </div>
};

export default BlockText
