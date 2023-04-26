import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function TabPanel(props) {
  const { children, value, index, interfaceId, label, ...other } = props;

  return (
    <div className="Tabs__panel"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function({ tabs, className }) {
  const [currentTabInterfaceId, setCurrentTabInterfaceId] = React.useState(0)

  function handleChange(interfaceId) {
    setCurrentTabInterfaceId(interfaceId)
  }

  return <TabsBody className={className} tabs={tabs} currentTabInterfaceId={currentTabInterfaceId} onChange={handleChange}/>
}

export function TabsBody({ tabs, currentTabInterfaceId, onChange, className }) {
  const theme = useTheme();

  const handleChange = (event, tabIndex) => {
    const interfaceId = tabs[tabIndex].interfaceId
    onChange(interfaceId);
  };

  let value = tabs.findIndex(tab => tab.interfaceId === currentTabInterfaceId)

  if(value === -1) {
    value = 0
  }

  return (
    <div className={"Tabs " + className}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          {tabs.map((tab, index) => {
            return <Tab key={tab.label} label={tab.label} {...a11yProps(index)} />
          })}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
      >
        {tabs.map((tab, index) => {
          return <TabPanel key={tab.label} label={tab.label} value={value} index={index} dir={theme.direction}>
            {tab.body}
          </TabPanel>
        })}
      </SwipeableViews>
    </div>
  );
}