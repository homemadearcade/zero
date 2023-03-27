import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceList.scss';

import Loader from '../../../ui/Loader/Loader';
import { getExperiences } from '../../../store/actions/experienceActions';
import TextField from '../../../ui/TextField/TextField';

const ExperienceList = ({ getExperiences, children, experience: { experiences, isLoading }}) => {
  useEffect(() => {
    getExperiences();
  }, [getExperiences]);

  const [searchTerm, setSearchTerm] = useState("")
  const [experienceList, setExperienceList] = useState(experiences)

  useEffect(() => {
    if(searchTerm) {
      setExperienceList(experiences.filter((experience) => {
        if(experience.metadata.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experience.owner?.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experience.metadata.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experience.metadata.authorPseudonym?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      }))
    } else {
      setExperienceList(experiences)
    }
  }, [searchTerm, experiences])

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="ExperienceList">
      <TextField onChange={handleSearchChange} value={searchTerm} label={"Search"} />
      {isLoading ? (
        <Loader />
      ) : <div className="ExperienceList__list">{experienceList.map(children)}</div>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  experience: state.experience,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getExperiences })
)(ExperienceList);
