/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import dayjs from 'dayjs'

import './EventDateList.scss';
import Typography from '../../ui/Typography/Typography';

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
  title,
  location, 
  dates,
  renderCallToActionSection
}) => {

  const sortedDates = dates.sort((a, b) => {
    return Number(new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }).reverse()
  
  return (
    <div className="EventDateList">
      {sortedDates.map(({id, startDate}) => {
        const date = dayjs(startDate)

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
              <Typography variant="subtitle2">{title}</Typography>
              <Typography variant="subtitle1">{location}</Typography>
            </div>
          </div>
          {renderCallToActionSection && <div className="EventDateList__cta">
            {renderCallToActionSection(id)}
          </div>}
        </div>
      })}
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }),
)(EventDateList);
