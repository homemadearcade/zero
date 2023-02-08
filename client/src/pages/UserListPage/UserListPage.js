import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';
import moment from 'moment';

import { getUsers } from '../../store/actions/usersActions';
import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';

import './styles.css';
import Typography from '../../ui/Typography/Typography';
import PageHeader from '../../ui/PageHeader/PageHeader';
import Button from '../../ui/Button/Button';
import { editUser } from '../../store/actions/userActions';

const UserListPage = ({ getUsers, editUser, users: { users, isLoading } }) => {
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Layout>
      <div className="UserListPage">
        <PageHeader
          title="Users page"
          description="This is the Users page. Here are listed all of the users of the app. Click the username link to go to user's profile. Only admin users can see this page."
        ></PageHeader>
        <p>
        </p>
        <div className="list">
          {isLoading ? (
            <Loader text="Loading Users..."/>
          ) : (
            <>
              {users.map((user, index) => {
                console.log(user)
                if(user.isRemoved) return null
                return (
                  <div key={index} className="profile">
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
                        <span className="label">Role: </span>
                        <span className="info">{user.role}</span>
                      </div>
                      <div>
                        <span className="label">Username: </span>
                        <Link to={`/user/${user.username}`}>
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
                      <Button onClick={async () => {
                        await editUser(user.id, {
                          isRemoved: true
                        })
                        getUsers()
                      }}>
                        Remove
                      </Button>
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

export default compose(requireAuth, requireAdmin, connect(mapStateToProps, { getUsers, editUser }))(UserListPage);
