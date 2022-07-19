import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addLobby } from '../../store/actions/lobbyActions';
import { lobbyFormSchema } from './validation';

import './styles.css';
import Button from '../ui/Button/Button';
import Typography from '../ui/Typography/Typography';

const LobbyForm = ({ addLobby, onSubmit }) => {
  const formik = useFormik({
    initialValues: {
      participantEmail: '',
      startTime: ''
    },
    validationSchema: lobbyFormSchema,
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      await addLobby({ participantEmail: values.participantEmail, startTime: values.startTime });
      onSubmit()
    },
  });

  return (
    <div className="LobbyForm">
      <Typography variant="h2" component="h2">Add a lobby</Typography>
      <form onSubmit={formik.handleSubmit}>
        <div className="input-div">
          <label>Participant Email:</label>
          <input
            placeholder="Participant Email"
            name="participantEmail"
            className=""
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.participantEmail}
          />
          {formik.touched.participantEmail && formik.errors.participantEmail ? (
            <p className="error">{formik.errors.participantEmail}</p>
          ) : null}
        </div>
        <div className="input-div">
          <label>Start Time:</label>
          <input
            placeholder="Start Time"
            name="startTime"
            className=""
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startTime}
          />
          {formik.touched.startTime && formik.errors.startTime ? (
            <p className="error">{formik.errors.startTime}</p>
          ) : null}
        </div>
        <Button type="submit" className="btn">Add Lobby</Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default connect(mapStateToProps, { addLobby })(LobbyForm);
