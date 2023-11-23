import React from 'react';
import { connect } from 'react-redux';
import Typography from '../../../ui/Typography/Typography';
import EntityItem from '../EntityItem/EntityItem';

import './EntityBehaviorTitle.scss'

const EntityBehaviorTitle = ({ title, entityModelId }) => {
  return (
    <div className="EntityBehaviorTitle">
      <EntityItem entityModelId={entityModelId} 
        height="3.3em"
        width="4.5em"
      />
      <Typography component="h5" variant="h5">{title}</Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, { })(EntityBehaviorTitle);
