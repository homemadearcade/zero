import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { getLobbys } from '../../store/actions/lobbysActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.scss';

const Lobbys = ({ getLobbys, lobbys: { lobbys, isLoading } }) => {
  useEffect(() => {
    getLobbys();
  }, []);

  return (
    <Layout>
      <div className="LobbysPage">
        <h1>Lobbies</h1>
        <p>
          This is the lobbies page where all active lobbies are listed. Only admin users can see this page.
        </p>
        <div className="LobbysPage__list">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {lobbys.map((user, index) => {
                return (
                  <div key={index} className="LobbysPage__lobby">
                  </div>
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
  lobbys: state.lobbys,
});

export default compose(requireAuth, requireAdmin, connect(mapStateToProps, { getLobbys  }))(Lobbys);
