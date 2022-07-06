import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addGame } from '../../store/actions/gameActions';
import { gameFormSchema } from './validation';

import './styles.css';

const GameForm = ({ addGame, onSubmit, auth: { me } }) => {
  const formik = useFormik({
    initialValues: {
      objects: {},
      hero: {},
      world: {},
      metadata: {},
      classes: {},
      userId: me.id
    },
    validationSchema: gameFormSchema,
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      await addGame(values);
      onSubmit()
    },
  });

//   <div className="input-div">
//   <label>Participant Email:</label>
//   <input
//     placeholder="Participant Email"
//     name="participantEmail"
//     className=""
//     type="text"
//     onChange={formik.handleChange}
//     onBlur={formik.handleBlur}
//     value={formik.values.participantEmail}
//   />
//   {formik.touched.participantEmail && formik.errors.participantEmail ? (
//     <p className="error">{formik.errors.participantEmail}</p>
//   ) : null}
// </div>
// <div className="input-div">
//   <label>Start Time:</label>
//   <input
//     placeholder="Start Time"
//     name="startTime"
//     className=""
//     type="text"
//     onChange={formik.handleChange}
//     onBlur={formik.handleBlur}
//     value={formik.values.startTime}
//   />
//   {formik.touched.startTime && formik.errors.startTime ? (
//     <p className="error">{formik.errors.startTime}</p>
//   ) : null}
// </div>

  return (
    <div className="GameForm">
      <h2>Add a game</h2>
      <form onSubmit={formik.handleSubmit}>
        <button type="submit" className="btn">Add Game</button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addGame })(GameForm);
