/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getUserByUsername, editUser, deleteUser } from '../../store/actions/userActions';
import { logOutUser } from '../../store/actions/authActions';

import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { userSchema } from './validation';

import './styles.scss';
import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import { ADMIN_ROLE } from '../../game/constants';

const User = ({
  getUserByUsername,
  user: { user, isLoading },
  auth: { me },
  editUser,
  deleteUser,
  logOutUser,
  history,
  match,
}) => {
  const onLogOut = (event) => {
    event.preventDefault();
    logOutUser(history);
  };

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  // const [avatar, setAvatar] = useState(null);
  const retryCount = useRef(0);
  const matchUsername = match.params.username;

  useEffect(() => {
    getUserByUsername(matchUsername, history);
  }, [matchUsername]);

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    // setAvatar(event.target.files[0]);
  };

  const handleClickEdit = () => {
    retryCount.current = 0;
    setIsEdit((oldIsEdit) => !oldIsEdit);
    setImage(null);
    // setAvatar(null);
    formik.setFieldValue('id', user.id);
    formik.setFieldValue('name', user.name);
    formik.setFieldValue('username', user.username);
    formik.setFieldValue('role', user.role);
  };

  const handleDeleteUser = (id, history) => {
    deleteUser(id, history);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: '',
      username: user.username,
      password: '',
      role: user.role,
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      // formData.append('avatar', avatar);
      formData.append('username', values.username);
      
      if(me?.role === ADMIN_ROLE) {
        formData.append('role', values.role);
      }

      if (user.provider === 'email') {
        formData.append('password', values.password);
      }
      editUser(values.id, formData, history);
      //setIsEdit(false);
    },
  });

  return (
    <Layout>
      <div className="UserPage">
        <Typography component="h1" variant="h1">{user.username + "'s account"}</Typography>
          This is all your account information. You can edit your account here.
        {isLoading ? (
          <Loader text="Loading User..."/>
        ) : (
          <div className="user-info">
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
                <span className="info">{user.username}</span>
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
              <div>
                <Button
                  className="btn"
                  type="button"
                  onClick={handleClickEdit}
                  disabled={!(me?.username === user.username || me?.role === ADMIN_ROLE)}
                >
                  {isEdit ? 'Cancel' : 'Edit'}
                </Button>
                {me?.id === user.id && <Button
                  onClick={onLogOut}
                  type="button"
                  className="btn"
                >
                  Logout
                </Button>}
              </div>
            </div>
          </div>
        )}

        {isEdit && (
          <div className="form">
            <form onSubmit={formik.handleSubmit}>
              <div>
                {null && <>
                  <label>Avatar:</label>
                  <input name="image" type="file" onChange={onChange} />
                </>}
                {image && (
                  <Button
                    className="btn"
                    onClick={() => {
                      setImage(null);
                      // setAvatar(null);
                    }}
                    type="button"
                  >
                    Remove Image
                  </Button>
                )}
              </div>
              <input name="id" type="hidden" value={formik.values.id} />
              <div className="input-div">
                <label>Username:</label>
                <input
                  placeholder="Username"
                  name="username"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username ? (
                  <p className="error">{formik.errors.username}</p>
                ) : null}
              </div>
              {me?.role === ADMIN_ROLE && <div className="input-div">
                <label>Role:</label>
                <select
                  placeholder="Role"
                  name="role"
                  className=""
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.role}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                {formik.touched.role && formik.errors.role ? (
                  <p className="error">{formik.errors.role}</p>
                ) : null}
              </div>}
              {user.provider === 'email' && (
                <div className="input-div">
                  <label>Password:</label>
                  <input
                    placeholder="Password"
                    name="password"
                    className=""
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <p className="error">{formik.errors.password}</p>
                  ) : null}
                </div>
              )}
              <Button type="submit" className="btn">
                Save
              </Button>
              {null && <Button
                onClick={() => handleDeleteUser(user.id, history)}
                type="button"
                className="btn"
              >
                Delete user
              </Button>}
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth,
});

export default compose(
  requireAuth,
  withRouter,
  connect(mapStateToProps, { getUserByUsername, editUser, deleteUser, logOutUser }),
)(User);
