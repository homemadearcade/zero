import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperienceList.scss';

import Loader from '../../../../ui/Loader/Loader';
import { getExperienceModels } from '../../../../store/actions/experienceModelActions';
import TextField from '../../../../ui/TextField/TextField';

const ExperienceList = ({ getExperienceModels, children, experienceModel: { experienceModels, isLoading }}) => {
  useEffect(() => {
    getExperienceModels();
  }, [getExperienceModels]);

  const [searchTerm, setSearchTerm] = useState("")
  const [experienceList, setExperienceList] = useState(experienceModels)

  useEffect(() => {
    if(searchTerm) {
      setExperienceList(experienceModels.filter((experienceModel) => {
        if(experienceModel.metadata.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experienceModel.owner?.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experienceModel.metadata.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(experienceModel.metadata.authorPseudonym?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      }))
    } else {
      setExperienceList(experienceModels)
    }
  }, [searchTerm, experienceModels])

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
  experienceModel: state.experienceModel,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getExperienceModels })
)(ExperienceList);
