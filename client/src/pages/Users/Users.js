import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../app/ui/Link/Link';
import moment from 'moment';

import { getUsers } from '../../store/actions/usersActions';
import Layout from '../../layout/Layout';
import Loader from '../../app/ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.css';
import Typography from '../../app/ui/Typography/Typography';

const Users = ({ getUsers, users: { users, isLoading } }) => {
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <div className="UsersPage">
        <Typography component="h1" variant="h1">Users page</Typography>
        <p>
          This is the Users page. Here are listed all of the users of the app. Click the username link to go to user's profile. Only admin users can see this page.
        </p>
        <div className="list">
          {isLoading ? (
            <Loader text="Loading Users..."/>
          ) : (
            <>
              {users.map((user, index) => {
                return (
                  <div key={index} className="profile">
                    {null && <Link to={`/${user.username}`}>
                      <img src={user.avatar} className="avatar" />
                    </Link>}
                    <div className="info-container">
                      <div>
                        <span className="label">Provider: </span>
                        <span className="info">{user.provider}</span>
                      </div>
                      <div>
                        <span className="label">Role: </span>
                        <span className="info">{user.role}</span>
                      </div>
                      <div>
                        <span className="label">Username: </span>
                        <Link to={`/${user.username}`}>
                          {user.username}
                        </Link>
                      </div>
                      <div>
                        <span className="label">Email: </span>
                        <span className="info">{user.email}</span>
                      </div>
                      <div>
                        <span className="label">Joined: </span>
                        <span className="info">
                          {moment(user.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                        </span>
                      </div>
                    </div>
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
  users: state.users,
});

export default compose(requireAuth, requireAdmin, connect(mapStateToProps, { getUsers }))(Users);
