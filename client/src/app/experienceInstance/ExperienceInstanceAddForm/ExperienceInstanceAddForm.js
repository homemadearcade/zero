import React, { useState } from 'react';
import { connect } from 'react-redux';
// import { lobbyInstanceFormSchema } from './validation';
import { useForm } from "react-hook-form";

import './styles.css';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import moment from 'moment';
import SelectExperienceModel from '../../../ui/connected/SelectExperienceModel/SelectExperienceModel';
import { getExperienceModelByMongoId } from '../../../store/actions/experience/experienceModelActions';
import './ExperienceInstanceAddForm.scss';
import Dialog from '../../../ui/Dialog/Dialog';
import ExperienceInstanceForm from '../ExperienceInstanceForm/ExperienceInstanceForm';

const ExperienceInstanceAddForm = ({ 
  onSubmit, 
  getExperienceModelByMongoId,
  experienceModel: { experienceModel } }) => {

  const [experienceId, setExperienceId] = useState()

  return (
    <div className="ExperienceInstanceAddForm">
        <Typography variant="h5" component="h5">Add an Experience Instance</Typography>
        <SelectExperienceModel value={experienceId ? [experienceId] : []} onSelect={(experienceModels) => {
          if(experienceModels[0]) {
            const id = experienceModels[experienceModels.length -1].id
            getExperienceModelByMongoId(id)
            setExperienceId(id)
          }
        }}/>
        {experienceId && experienceModel && <Dialog open>
          <div className="ExperienceInstanceAddForm__dialog">
            <ExperienceInstanceForm onSubmit={() => {
              setExperienceId(null)
              onSubmit()
            }}/>
          </div>
        </Dialog>}
      </div>
  );
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel
});

export default connect(mapStateToProps, { getExperienceModelByMongoId })(ExperienceInstanceAddForm);
