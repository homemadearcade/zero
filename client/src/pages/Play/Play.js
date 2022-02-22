import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Layout from '../../layout/Layout';
import GameView from '../../components/GameView/GameView';

import './styles.css';

const Home = ({ auth }) => {
  return (
    <Layout>
      <div className="home-page">
        <h1>Phaser Tests</h1>
        <GameView/>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { }))(Home);
