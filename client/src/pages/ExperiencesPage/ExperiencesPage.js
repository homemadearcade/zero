import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperiencesPage.scss';

import Layout from '../../layout/Layout';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import Button from '../../ui/Button/Button';
import ExperienceList from '../../app/experienceModel/experience/ExperienceList/ExperienceList';
import ExperienceCard from '../../app/experienceModel/experience/ExperienceCard/ExperienceCard';
import { getExperienceModels } from '../../store/actions/experience/experienceModelActions';
import ExperienceAddForm from '../../app/experienceModel/experience/ExperienceAddForm/ExperienceAddForm';

const ExperiencesPage = ({getExperienceModels}) => {
  return (
    <Layout>
      <div className="ExperiencesPage">
        <PageHeader 
          title="Experiences page"
          description="This is the Experiences page. Here are listed all of the experiences."
        ></PageHeader>
        <ExperienceAddForm onSubmit={getExperienceModels}></ExperienceAddForm>
        <div className="ExperiencesPage__list">
          <ExperienceList>{(experienceModel) => {
            return <ExperienceCard key={experienceModel.id} width={300} experienceModel={experienceModel} canPlay canEdit canPublish canRemove></ExperienceCard>
          }}</ExperienceList>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  requireAuth,
  requireAdmin,
  connect(mapStateToProps, { getExperienceModels }))(ExperiencesPage);
