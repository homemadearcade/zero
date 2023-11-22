import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { getLobbys } from '../../store/actions/experience/lobbyInstancesActions';
import { deleteLobby } from '../../store/actions/experience/lobbyInstanceActions';
import { getAppSettings } from '../../store/actions/appSettingsActions';

import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
// import ExperienceInstanceAddForm from '../../app/experienceInstance/ExperienceInstanceAddForm/ExperienceInstanceAddForm';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.scss';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import Link from '../../ui/Link/Link';
import PageHeader from '../../ui/PageHeader/PageHeader';
import LobbyInstanceCard from '../../app/lobbyInstance/LobbyInstanceCard/LobbyInstanceCard';
import { APP_ADMIN_ROLE } from '../../constants';
import ExperienceInstanceButton from '../../app/experienceInstance/ExperienceInstanceButton/ExperienceInstanceButton';

const LobbyListPage = ({ history, getLobbys, lobbyInstances: { lobbyInstances, isLoading }, appSettings: { appSettings }, getAppSettings, auth: { me } }) => {
  useEffect(() => {
    getLobbys();
  }, [getLobbys]);

  useEffect(() => {
    getAppSettings()
  }, [getAppSettings])

  return (
    <Layout>
      <div className="LobbyListPage">
        <PageHeader 
          title="Lobbies Page"
          description={`This is the lobbies page where all active lobbies are listed. Only admin users can see this page.`}
        ></PageHeader>
        {/* <ExperienceInstanceAddForm onSubmit={() => {
            getLobbys()
        }}/> */}
        {me?.roles[APP_ADMIN_ROLE] && <ExperienceInstanceButton 
          experienceModelMongoId={appSettings.homemadeArcadeExperienceModelMongoId} 
          variant="contained" 
          size="large"
          onSubmit={() => {
            getLobbys()
          }}
        >
            Create a Homemade Arcade Lobby
        </ExperienceInstanceButton>}
        <div className="LobbyListPage__list">
          {isLoading ? (
            <Loader text="Lobbys Loading..."/>
          ) : (
          <>
              {lobbyInstances.map((lobbyInstance, index) => {
                return (
                  <LobbyInstanceCard key={lobbyInstance.id} lobbyInstance={lobbyInstance} canDelete></LobbyInstanceCard>
                );
              })} 
            </>
          )}
        </div>
      </div> 
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstances: state.lobbyInstances,
  appSettings: state.appSettings,
  auth: state.auth
});

export default compose(
  requireAuth,
  requireAdmin,  
  withRouter,
  connect(mapStateToProps, { getAppSettings, getLobbys }))(LobbyListPage);
