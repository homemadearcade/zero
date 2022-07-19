import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useFormik } from 'formik';

import { deleteMessage, editMessage, clearMessageError } from '../../store/actions/messageActions';
import { messageFormSchema } from './validation';
import Button from '../../ui/Button/Button';

import './styles.css';

const MessageItem = ({ message, auth, deleteMessage, editMessage, clearMessageError }) => {
  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = (e, id) => {
    e.preventDefault();
    if (!isEdit) {
      deleteMessage(id);
    }
  };

  const handleClickEdit = (e) => {
    e.preventDefault();
    formik.setFieldValue('text', message.text);
    setIsEdit((oldIsEdit) => !oldIsEdit);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      text: '',
      id: message.id,
    },
    validationSchema: messageFormSchema,
    onSubmit: (values, { resetForm }) => {
      editMessage(values.id, { text: values.text });
      setIsEdit(false);
      // resetForm();
    },
  });

  // dont reset form if there is an error
  useEffect(() => {
    if (!message.error && !message.isLoading) formik.resetForm();
  }, [message.error, message.isLoading]);

  // keep edit open if there is an error
  useEffect(() => {
    if (message.error) setIsEdit(true);
  }, [message.error]);

  return (
    <div className={message.isLoading ? 'message loader' : 'message'}>
      <div className="message-header">
        <Link to={`/${message.user.username}`}>
          <img src={message.user.avatar} className="avatar" />
        </Link>
        <div>
          <Link to={`/${message.user.username}`} className="name">
            {message.user.username}
          </Link>
          <span className="username">@{message.user.username}</span>
          <span className="time text-light">{moment(message.createdAt).fromNow()}</span>
          {!moment(message.createdAt).isSame(message.updatedAt, 'minute') && (
            <span className="time text-light">{`Edited: ${moment(
              message.updatedAt,
            ).fromNow()}`}</span>
          )}
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        {isEdit ? (
          <>
            <textarea
              name="text"
              rows="3"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.text}
              disabled={message.isLoading}
            />
            <input type="hidden" name="id" />
            {(formik.touched.text && formik.errors.text) || message.error ? (
              <p className="error">{formik.errors.text || message.error}</p>
            ) : null}
          </>
        ) : (
          <p>{message.text}</p>
        )}
        {auth.isAuthenticated && (auth.me.id === message.user.id || auth.me.role === 'ADMIN') && (
          <>
            {!isEdit ? (
              <>
                <Button onClick={handleClickEdit} type="Button" className="btn">
                  Edit
                </Button>
                <Button onClick={(e) => handleDelete(e, message.id)} type="Button" className="btn">
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Button type="submit" className="btn" disabled={message.isLoading}>
                  Submit
                </Button>
                <Button
                  onClick={() => {
                    setIsEdit((oldIsEdit) => !oldIsEdit);
                    clearMessageError(message.id);
                  }}
                  type="Button"
                  className="btn"
                >
                  Cancel
                </Button>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteMessage, editMessage, clearMessageError })(MessageItem);
