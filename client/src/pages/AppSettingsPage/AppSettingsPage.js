/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';


import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';

import PageHeader from '../../ui/PageHeader/PageHeader';
import WithAppSettings from '../../hoc/WithAppSettings';
import SelectArcadeGame from '../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import { editAppSettings } from '../../store/actions/appSettingsActions';
import SelectExperienceModel from '../../ui/connected/SelectExperienceModel/SelectExperienceModel';

const AppSettingsPage = ({
  appSettings: { appSettings },
  editAppSettings
}) => {

  console.log(appSettings)
  return (
      <Layout>
        <WithAppSettings>
          <div className="AppSettingsPage">
            <PageHeader
              title={'App Settings'}
              description="These are all the settings of the app"
            ></PageHeader>
            <div>
              <SelectExperienceModel 
                label="What experience determines the editor interface by default?"
                value={appSettings.userEditorExperienceMongoId ? [appSettings.userEditorExperienceMongoId] : []} onSelect={(experienceModels) => {
                  console.log(experienceModels, experienceModels[experienceModels.length-1].id)
                if(experienceModels[0]) {
                  editAppSettings({ userEditorExperienceMongoId: experienceModels[experienceModels.length-1].id})
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
        </WithAppSettings>
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
