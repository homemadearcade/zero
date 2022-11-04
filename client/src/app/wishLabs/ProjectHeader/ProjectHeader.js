import React, { } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ProjectHeader.scss';
import Typography from '../../../ui/Typography/Typography';
import Link from '../../../ui/Link/Link';

const ProjectHeader = ({ title, subtitle, logoSrc, websiteLink }) => {
 return <div className="ProjectHeader">
    <div className="ProjectHeader__background" style={{backgroundImage: `url("${logoSrc}"`}}>
    </div>
    <div className="ProjectHeader__body">
      <img src={logoSrc}></img>
      <div className="ProjectHeader__info">
        <Typography component="h3" variant="h3">{title}</Typography>
        <Typography component="h5" variant="h5">{subtitle}</Typography>
        {websiteLink && <Link href={websiteLink} newTab>Website</Link>}
      </div>
    </div>
 </div>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(ProjectHeader);
