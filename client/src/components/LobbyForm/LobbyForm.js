import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addLobby } from '../../store/actions/lobbyActions';
import { lobbyFormSchema } from './validation';

import './styles.css';

const MessageForm = ({ addLobby, lobby: { lobbys } }) => {
  const formik = useFormik({
    initialValues: {
      participantEmail: '',
    },
    validationSchema: lobbyFormSchema,
    onSubmit: (values, { resetForm }) => {
      addLobby({ text: values.text });
      resetForm();
    },
  });

  const isSubmiting = lobbys.some((m) => m.id === 0);

  return (
    <div className="LobbyForm">
      <h2>Add a lobby</h2>
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
        
        <input type="submit" className="btn" value="Add Lobby" disabled={isSubmiting} />
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default connect(mapStateToProps, { addLobby })(MessageForm);
