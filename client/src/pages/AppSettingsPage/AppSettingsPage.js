/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';


import Layout from '../../layout/Layout';
import requireAuth from '../../hoc/requireAuth';

import PageHeader from '../../ui/PageHeader/PageHeader';
import SelectArcadeGame from '../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import { editAppSettings } from '../../store/actions/appSettingsActions';
import SelectExperienceModel from '../../ui/connected/SelectExperienceModel/SelectExperienceModel';

const AppSettingsPage = ({
  appSettings: { appSettings },
  editAppSettings
}) => {
  return (
      <Layout>
          <div className="AppSettingsPage">
            <PageHeader
              title={'App Settings'}
              description="These are all the settings of the app"
            ></PageHeader>
            <div>
              <SelectExperienceModel 
                label="What experience determines the editor interface by default?"
                value={appSettings.editorExperienceModelMongoId ? [appSettings.editorExperienceModelMongoId] : []} onSelect={(experienceModels) => {
                  console.log(experienceModels, experienceModels[experienceModels.length-1].id)
                if(experienceModels[0]) {
                  editAppSettings({ editorExperienceModelMongoId: experienceModels[experienceModels.length-1].id})
                }
              }}/>              
              <SelectArcadeGame 
                label="What games are imported to a new game by default?" 
                gamesSelected={appSettings.importedArcadeGameMongoIds ? appSettings.importedArcadeGameMongoIds : []} 
                onSelect={(arcadeGames) => {
                  editAppSettings({ importedArcadeGameMongoIds: arcadeGames.map((game) => game.id) })
                }}/>
            </div>
          </div>
      </Layout>
  );
};

const mapStateToProps = (state) => ({
  appSettings: state.appSettings,
});

export default compose(
  requireAuth,
  requireAuth,
  connect(mapStateToProps, { editAppSettings }),
)(AppSettingsPage);
