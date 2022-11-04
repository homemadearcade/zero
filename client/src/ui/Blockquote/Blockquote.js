import React, { useEffect, useRef, useState } from 'react';
import Link from '../Link/Link';

import './Blockquote.scss';

const Blockquote = ({ quote, cite, className, seeMoreLink }) => {
  return <div className={"Blockquote " + className}>
    <blockquote>
      {quote}
      {seeMoreLink && <Link className="Blockquote__read-more" newTab href={seeMoreLink}>Read more..</Link>}
    </blockquote>
    <cite>
      {cite}
    </cite>
  </div>
};

export default Blockquote
