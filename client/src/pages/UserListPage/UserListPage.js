import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';
import moment from 'moment';

import { getUsers } from '../../store/actions/user/usersActions';
import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.css';
import Typography from '../../ui/Typography/Typography';
import PageHeader from '../../ui/PageHeader/PageHeader';
import Button from '../../ui/Button/Button';
import { editUser } from '../../store/actions/user/userActions';
import UserList from '../../app/user/UserList/UserList';

const UserListPage = ({ getUsers, editUser, users: { users, isLoading } }) => {


  return (
    <Layout>
      <div className="UserListPage">
        <PageHeader
          title="Users page"
          description="This is the Users page. Here are listed all of the users of the app. Click the username link to go to user's profile. Only admin users can see this page."
        ></PageHeader>
        <p>
        </p>

        <div className="list">           <UserList>
            {(user, index) => {
                return <div key={index} className="profile">
                    {null && <img src={user.avatar} className="avatar" />}
                    <div className="info-container">
                      <div>
                        <span className="label">id: </span>
                        <span className="info">{user.id}</span>
                      </div>
                      <div>
                        <span className="label">Provider: </span>
                        <span className="info">{user.provider}</span>
                      </div>
                      <div>
                        <span className="label">Username: </span>
                          {user.username}
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

                      <Link to={`/user/${user.username}`}>
                        Account
                      </Link>
                      <Link to={`/user/${user.username}/creations`}>
                        Creations
                      </Link>

                      {!user.isRemoved && <Button onClick={async () => {
                        await editUser(user.id, {
                          isRemoved: true
                        })
                        getUsers()
                      }}>
                        Remove
                      </Button>}
                       {user.isRemoved && <Button onClick={async () => {
                        await editUser(user.id, {
                          isRemoved: false
                        })
                        getUsers()
                      }}>
                        Restore
                      </Button>}

                    </div>
                  </div>
              
            }}
            </UserList>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  users: state.users,
});

export default compose(requireAuth, requireAdmin, connect(mapStateToProps, { getUsers, editUser }))(UserListPage);
