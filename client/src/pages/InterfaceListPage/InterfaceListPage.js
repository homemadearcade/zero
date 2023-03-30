import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';
import moment from 'moment';

import Layout from '../../layout/Layout';
import Loader from '../../ui/Loader/Loader';
import requireAuth from '../../hoc/requireAuth';
import requireAdmin from '../../hoc/requireAdmin';
import { deleteInterfacePreset, getInterfacePresets } from '../../store/actions/game/interfacePresetActions';

import './styles.css';
import PageHeader from '../../ui/PageHeader/PageHeader';
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Button from '../../ui/Button/Button';

const InterfaceListPage = ({ getInterfacePresets, deleteInterfacePreset, interfacePreset: { interfacePresets, isLoading } }) => {
  useEffect(() => {
    getInterfacePresets();
  }, []);

  return (
    <Layout>
      <div className="InterfaceListPage">
        <PageHeader
          title="Interface Preset Page"
          description="This is the Interface Preset page. Here are listed all of the interface presets of the app. You can delete and edit interface presets. Only admin users can see this page."
        ></PageHeader>
        {isLoading ?  <Loader text="Loading Interface Presets..."/>
           : interfacePresets.map((interfacePreset) => {
              return <List>
                <ListItem divider  secondaryAction={<Button 
                    variant="contained" 
                    onClick={async () => {
                      await deleteInterfacePreset(interfacePreset.id)
                      await getInterfacePresets()
                  }}>
                    Trash
                  </Button>
                }>
                  <ListItemButton onClick={() => {

                }}>
                    <ListItemText primary={interfacePreset.name} secondary={interfacePreset.description} />
                  </ListItemButton>
                </ListItem>
              </List>
        })}
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  interfacePreset: state.interfacePreset,
});

export default compose(requireAuth, requireAdmin, connect(mapStateToProps, { deleteInterfacePreset, getInterfacePresets }))(InterfaceListPage);
