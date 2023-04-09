import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectExperienceModel.scss';

import Loader from '../../Loader/Loader';
import SelectChipsAuto from '../../SelectChipsAuto/SelectChipsAuto';
import { getExperienceModels } from '../../../store/actions/experience/experienceModelActions';

const SelectExperienceModel = ({ excludedIds, onSelect, label, userMongoId, getExperienceModels, value = [], experienceModel: { experienceModels, isLoading }}) => {
  useEffect(() => {
    getExperienceModels();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(isLoading) return <Loader></Loader>

  if(!experienceModels.length) return <div>No Experiences</div>;

   const mapGameToOption = (experienceModel) => {
    const firstLetter = experienceModel.owner ? experienceModel.owner.username[0].toUpperCase() : 'fromprod'
    return {
      owner: experienceModel.owner,
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      label: experienceModel.metadata.title,
      value: experienceModel.id,
      isRemoved: experienceModel.isRemoved
    }
  }

  let options = experienceModels.map(mapGameToOption).sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))

  if(userMongoId) {
    options = options.filter((option) => {
      if(excludedIds && excludedIds.indexOf(option.value) === 0) {
        return false
      }

      if(option.owner && option.owner.id === userMongoId) {
        return true
      } else if(value.indexOf(option.value) >= 0) {
        return true
      }
      return false
    })
  }
  
  return (
    <div className="SelectExperienceModel">
      <SelectChipsAuto
        onChange={(event, experienceModelMongoId) => {
          const experiences = experienceModels.filter((experienceModel) => experienceModelMongoId.indexOf(experienceModel.id) >= 0)
          onSelect(experiences)
        }}
        groupBy={(option) => option.firstLetter}
        hideRemoved
        formLabel={label ? label : "Experiences by Owner name"}
        value={value}
        options={options}
      />
    </div>
  );

};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default compose(
  connect(mapStateToProps, { getExperienceModels }))(SelectExperienceModel);
