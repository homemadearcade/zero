import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ExperiencesPage.scss';

import Layout from '../../layout/Layout';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import Button from '../../ui/Button/Button';
import ExperienceList from '../../app/experienceCreator/ExperienceList/ExperienceList';
import ExperienceCard from '../../app/experienceCreator/ExperienceCard/ExperienceCard';
import { getExperiences } from '../../store/actions/experienceActions';
import ExperienceAddForm from '../../app/experienceCreator/ExperienceAddForm/ExperienceAddForm';

const ExperiencesPage = ({getExperiences}) => {
  const [showRemovedExperiences, setShowRemovedExperiences] = useState()
  return (
    <Layout>
      <div className="ExperiencesPage">
        <PageHeader 
          title="Experiences page"
          description="This is the Experiences page. Here are listed all of the experiences."
        ></PageHeader>
        <ExperienceAddForm onSubmit={getExperiences}></ExperienceAddForm>
        {!showRemovedExperiences &&  <Button onClick={() => {
          setShowRemovedExperiences(true)
        }}>Show Removed Experiences</Button>}
        <div className="ExperiencesPage__list">
          <ExperienceList>{(experience) => {
            if(experience.isRemoved && !showRemovedExperiences) return
            return <ExperienceCard width={300} experience={experience} canPlay canEdit canPublish canRemove></ExperienceCard>
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
  connect(mapStateToProps, { getExperiences }))(ExperiencesPage);
