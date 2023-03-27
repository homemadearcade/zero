import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { getExperienceById } from '../store/actions/experienceActions';

// eslint-disable-next-line import/no-anonymous-default-export
class WithExperience extends Component {
  componentWillMount() {
    const { getExperienceById, match } = this.props

    const matchId = match.params.experienceId;
    getExperienceById(matchId)
  }

  render() {
    const { experience: { isLoading, experience }, children } = this.props;
    if(isLoading || !experience) {
      return <Loader text="Loading Experience..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
};

const mapStateToProps = (state) => ({
  experience: state.experience,
  // cobrowsing: state.cobrowsing
});

export default compose(
  withRouter, 
  connect(mapStateToProps, { getExperienceById })
)(WithExperience)
