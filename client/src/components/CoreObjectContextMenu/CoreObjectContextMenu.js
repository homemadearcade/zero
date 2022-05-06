import React from 'react';
import { connect } from 'react-redux';

const CoreObjectContextMenu = ({ interface: { interfaceState: { contextMenuObjectSelected} }}) => {
  
  return <div>

  </div>
};

const mapStateToProps = (state) => ({
  interface: state.interface
});

export default connect(mapStateToProps, { })(CoreObjectContextMenu);
