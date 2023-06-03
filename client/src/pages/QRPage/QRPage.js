import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';


const QRPage = ({ match }) => {
  useEffect(() => {
    window.location.href = `https://towalkthenight.com/homemade-arcade-games`
  }, [])

  return (
    <div className="QRPage">
      
    </div>
  );
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { })
)(QRPage);
