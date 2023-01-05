import React from 'react';
import { connect } from 'react-redux';
// import { lobbyFormSchema } from './validation';
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';

import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import { editTicketedEvent } from '../../store/actions/ticketedEventActions';
import DatePickerInline from '../../ui/DatePickerInline/DatePickerInline';
import TimePickerInline from '../../ui/TimePickerInline/TimePickerInline';
import dayjs from 'dayjs';

const AddEventDateForm = ({ onSubmit, editTicketedEvent, ticketedEvent: { ticketedEvents } }) => {
  const homemadeArcadeEvent = ticketedEvents[0]

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      day: '',
      time: '',
    },
  });
  const submit = async (data) => {
    if(!data.day || !data.time) return console.log('data not completed', data)
    
    const startDate = dayjs(data.day.format('YYYY-MM-DD') + data.time.format('THH:mm:ssZ'))
    homemadeArcadeEvent.dates.push({
      id: uuidv4(),
      startDate: startDate.toDate(),
      // endDate: 
    })

    editTicketedEvent(homemadeArcadeEvent.id, homemadeArcadeEvent)
  }

  return (
    <div className="AddEventDateForm">
      <Typography variant="h2" component="h2">Add a date</Typography>
      <form>
        <div>
          <Controller
            name={"day"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <DatePickerInline disablePast onChange={onChange} value={value}></DatePickerInline>
            )}
          />
        </div>
        <div>
          <Controller
            name={"time"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TimePickerInline onChange={onChange} value={value}></TimePickerInline>
            )}
          />
        </div>
        <Button type="submit" onClick={handleSubmit(submit)}>Add Date</Button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent,
});

export default connect(mapStateToProps, { editTicketedEvent })(AddEventDateForm);
