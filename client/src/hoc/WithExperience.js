import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { getExperienceModelById, clearExperienceModel } from '../store/actions/experienceModelActions';

// eslint-disable-next-line import/no-anonymous-default-export
class WithExperience extends Component {
  componentWillMount() {
    const { getExperienceModelById, match } = this.props

    const matchId = match.params.experienceId;
    getExperienceModelById(matchId)
  }

  componentWillUnmount() {
    const { clearExperienceModel } = this.props
    clearExperienceModel()
  }

  render() {
    const { experienceModel: { isLoading, experienceModel }, children } = this.props;
    if(isLoading || !experienceModel) {
      return <Loader text="Loading Experience..."/>
    }

    return children instanceof Function ? children(this.props) : children
  }
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
  // cobrowsing: state.cobrowsing
});

export default compose(
  withRouter, 
  connect(mapStateToProps, { getExperienceModelById, clearExperienceModel })
)(WithExperience)
