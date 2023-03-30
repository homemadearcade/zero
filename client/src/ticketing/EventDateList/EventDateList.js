/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import dayjs from 'dayjs'

import './EventDateList.scss';
import Typography from '../../ui/Typography/Typography';
import { getTicketedPurchaseByEventId } from '../../store/actions/ticketing/ticketPurchaseActions';
import { isDateSoldOut, isTicketSoldOut } from '../../utils/ticketUtils';
import Loader from '../../ui/Loader/Loader';

// const monthToMonthName = {
//   0: 'Jan',
//   1: 'Feb',
//   2: 'March',
//   3: 'April',
//   4: 'May',
//   5: 'June',
//   6: 'July',
//   7: 'August',
//   8: 'September',
//   9: 'October',
//   10: 'November',
//   11: 'December'
// }

const EventDateList = ({
  dates,
  renderCallToActionSection = () => {},
  renderDetails = () => {},
  ticketedEvent: { ticketPurchases, ticketedEvent, ticketedEvent: { id } },
  getTicketedPurchaseByEventId,
}) => {
  
  useEffect(() => {
    getTicketedPurchaseByEventId(id)
    // get the tickets for this event here in order to display the correct information
  }, [])
  
  const sortedDates = dates.sort((a, b) => {
    return Number(new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }).reverse()
  if(!ticketPurchases) return <Loader></Loader> 
  
  return (
    <div className="EventDateList">
      {sortedDates.map(({id, startDate}) => {
        const date = dayjs(startDate)

        const isSoldOut = isDateSoldOut({dateId: id, ticketPurchases, ticketedEvent})

        return <div className="EventDateList__date">
          <div className="EventDateList__body">
            <div className="EventDateList__calendar-date">
              <div className="EventDateList__calendar-date-month">
                {date.format('MMM')}
              </div>
              <div className="EventDateList__calendar-date-day">
                {date.format('D')}
              </div>
            </div>
            <div className="EventDateList__details">
              <Typography variant="h4">{date.format('LT') + ' PT'}</Typography>
              {renderDetails(id, isSoldOut)}
            </div>
          </div>
          {renderCallToActionSection && <div className="EventDateList__cta">
            {renderCallToActionSection(id, isSoldOut)}
          </div>}
        </div>
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({
  ticketedEvent: state.ticketedEvent
});

export default compose(
  connect(mapStateToProps, { getTicketedPurchaseByEventId }),
)(EventDateList);
