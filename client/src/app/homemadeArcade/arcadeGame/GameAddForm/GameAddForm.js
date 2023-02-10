import React from 'react';
import { connect } from 'react-redux';
import { useFormik } from 'formik';

import { addArcadeGame } from '../../../../store/actions/arcadeGameActions';
import { gameFormSchema } from './validation';

import './styles.css';
import Button from '../../../../ui/Button/Button';
import Typography from '../../../../ui/Typography/Typography';
import Icon from '../../../../ui/Icon/Icon';

const GameAddForm = ({ addArcadeGame, onSubmit, auth: { me } }) => {
  const formik = useFormik({
    initialValues: {
      player: {},
      stages: {},
      defaults: {},
      metadata: {},
      classes: {},
      brushes: {},
      colors: {},
      awsImages: {},
      userId: me.id
    },
    validationSchema: gameFormSchema,
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      await addArcadeGame(values);
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
    <div className="GameAddForm">
      <Typography variant="h5" component="h5">Add a game</Typography> 
      <form onSubmit={formik.handleSubmit}>
        <Button startIcon={<Icon icon="faPlus"/>} type="submit" className="btn">Add Game</Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { addArcadeGame })(GameAddForm);
