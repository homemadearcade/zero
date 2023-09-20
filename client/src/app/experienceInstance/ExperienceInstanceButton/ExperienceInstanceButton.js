import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
// import { lobbyInstanceFormSchema } from './validation';
import axios from 'axios';

import './ExperienceInstanceButton.scss';
import Button from '../../../ui/Button/Button';
import { getExperienceModelByMongoId, loadExperienceModel } from '../../../store/actions/experience/experienceModelActions';
import ExperienceInstanceForm from '../ExperienceInstanceForm/ExperienceInstanceForm';
import { attachTokenToHeaders } from '../../../store/actions/user/authActions';
import store from '../../../store';
import Dialog from '../../../ui/Dialog/Dialog';

const ExperienceInstanceButton = ({ 
  getExperienceModelByMongoId,
  experienceModelMongoId,
  onSubmit,
  variant,
  children
}) => {
  const [experienceModel, setExperienceModel] = useState()
  const [openExperienceInstanceForm, setOpenExperienceInstanceForm] = useState(false)

  useEffect(() => {
    async function doGetExperienceModelByMongoId() {
      if(!experienceModelMongoId) return
      if(!openExperienceInstanceForm) return
      const options = attachTokenToHeaders(store.getState);
      const experienceModelResponse = await axios.get('/api/experienceModel/' + experienceModelMongoId, options);
      setExperienceModel(await loadExperienceModel(experienceModelResponse))
    }
    doGetExperienceModelByMongoId()
  }, [experienceModelMongoId, getExperienceModelByMongoId, openExperienceInstanceForm])

    return <div className="ExperienceInstanceButton">
      <Button type="submit" variant={variant} onClick={() => {
        setOpenExperienceInstanceForm(true)
      }} >{children || 'Create Lobbys'}</Button>
      {experienceModel && openExperienceInstanceForm && 
        <Dialog open onClose={() => {
          setOpenExperienceInstanceForm(false)
        }}>
          <div className="ExperienceInstanceButton__dialog">
          <ExperienceInstanceForm 
            onSubmit={() => {
              setOpenExperienceInstanceForm(false)
              onSubmit()
            }}
            experienceModel={experienceModel}>
          </ExperienceInstanceForm>
          </div>
        </Dialog>
      }
    </div>

};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel
});

export default connect(mapStateToProps, { getExperienceModelByMongoId })(ExperienceInstanceButton);
