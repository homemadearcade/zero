import React from 'react';
import { connect } from 'react-redux';
import Typography from '../../../components/ui/Typography/Typography';
import ClassItem from '../ClassItem/ClassItem';

import './ClassMemberTitle.scss'

const ClassMemberTitle = ({ title, classId }) => {
  return (
    <div className="ClassMemberTitle">
      <ClassItem classId={classId} 
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
