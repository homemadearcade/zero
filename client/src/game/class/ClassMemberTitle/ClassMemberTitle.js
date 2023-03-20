import React from 'react';
import { connect } from 'react-redux';
import Typography from '../../../ui/Typography/Typography';
import ClassItem from '../ClassItem/ClassItem';

import './ClassMemberTitle.scss'

const ClassMemberTitle = ({ title, entityClassId }) => {
  return (
    <div className="ClassMemberTitle">
      <ClassItem entityClassId={entityClassId} 
        height="7vh"
        width="9.2vh"
      />
      <Typography component="h5" variant="h5">{title}</Typography>
    </div>
  );
};

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps, { })(ClassMemberTitle);
