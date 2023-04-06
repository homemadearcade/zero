import React from 'react';
import { connect } from 'react-redux';
import { Controller, useForm } from "react-hook-form";

import Button from '../../ui/Button/Button';
import Typography from '../../ui/Typography/Typography';
import { editTicketedEvent } from '../../store/actions/ticketing/ticketedEventActions';
import DatePickerInline from '../../ui/DatePickerInline/DatePickerInline';
import TimePickerInline from '../../ui/TimePickerInline/TimePickerInline';
import dayjs from 'dayjs';
import { generateUniqueId } from '../../utils/webPageUtils';
import { DATE_DID } from '../../game/constants';

const AddEventDateForm = ({ onSubmit, editTicketedEvent, ticketedEvent: { ticketedEvent } }) => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      day: '',
      time: '',
    },
  });
  const submit = async (data) => {
    if(!data.day || !data.time) return console.log('data not completed', data)
    
    const startDate = dayjs(data.day.format('YYYY-MM-DD') + data.time.format('THH:mm:ssZ'))
    ticketedEvent.dates.push({
      dateId: DATE_DID+generateUniqueId(),
      startDate: startDate.toDate(),
      // endDate: 
    })

    editTicketedEvent(ticketedEvent.id, ticketedEvent)
  }

  return (
    <div className="AddEventDateForm">
      <Typography variant="h2" component="h2">Add a date</Typography>
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
    </div>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent,
});

export default connect(mapStateToProps, { editTicketedEvent })(AddEventDateForm);
