import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useFormik } from 'formik';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { getUser, editUser, deleteUser } from '../../store/actions/userActions';
import { loadMe } from '../../store/actions/authActions';
import Layout from '../../layout/Layout';
import Loader from '../../components/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import { userSchema } from './validation';

import './styles.scss';

const User = ({
  getUser,
  user: { user, isLoading, error },
  auth: { me },
  editUser,
  deleteUser,
  loadMe,
  history,
  match,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const retryCount = useRef(0);
  const matchUsername = match.params.username;

  useEffect(() => {
    getUser(matchUsername, history);
  }, [matchUsername]);

  const onChange = (event) => {
    formik.setFieldValue('image', event.currentTarget.files[0]);
    setImage(URL.createObjectURL(event.target.files[0]));
    setAvatar(event.target.files[0]);
  };

  const handleClickEdit = () => {
    retryCount.current = 0;
    setIsEdit((oldIsEdit) => !oldIsEdit);
    setImage(null);
    setAvatar(null);
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
      username: '',
      password: '',
      role: '',
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      // formData.append('avatar', avatar);
      formData.append('username', values.username);
      
      if(me?.role === 'ADMIN') {
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
        <h1>Me</h1>
        <p>
          This is all your account information. You can edit your account here.
        </p>
        {isLoading ? (
          <Loader />
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
                <button
                  className="btn"
                  type="button"
                  onClick={handleClickEdit}
                  disabled={!(me?.username === user.username || me?.role === 'ADMIN')}
                >
                  {isEdit ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {isEdit && (
          <div className="form">
            <form onSubmit={formik.handleSubmit}>
              <div>
                {null && <>
                  <label>Avatar:</label>
                  <input name="image" type="file" onChange={onChange} />
                </>}
                {image && (
                  <button
                    className="btn"
                    onClick={() => {
                      setImage(null);
                      setAvatar(null);
                    }}
                    type="button"
                  >
                    Remove Image
                  </button>
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
              {me?.role === 'ADMIN' && <div className="input-div">
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
                  <option value="USER" selected={formik.values.role === "USER"}>USER</option>
                  <option value="ADMIN" selected={formik.values.role === "ADMIN"}>ADMIN</option>
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
              <button type="submit" className="btn">
                Save
              </button>
              <button
                onClick={() => handleDeleteUser(user.id, history)}
                type="button"
                className="btn"
              >
                Delete user
              </button>
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
  connect(mapStateToProps, { getUser, editUser, deleteUser, loadMe }),
)(User);
