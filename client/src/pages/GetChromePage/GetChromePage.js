import React from 'react';
import { compose } from 'redux';
import requireChrome from '../../hoc/requireChrome';
import Link from '../../ui/Link/Link';
import Typography from '../../ui/Typography/Typography';

const GetChromePage = () => {
  return <div>
    <Typography>
      Congrats! Your browser is Chrome-based.
    </Typography>
    <Link to="/">
      Home
    </Link>
  </div>
};

export default compose(requireChrome)(GetChromePage);
