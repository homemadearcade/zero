import React, { Component } from 'react';
import { connect } from 'react-redux';
import GetChromePage from '../pages/GetChromePage/GetChromePage';
import { setRedirect } from '../store/actions/authActions';
import Loader from '../ui/Loader/Loader';
import { checkIfTabAlreadyOpen } from '../utils/webPageUtils';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class ComposedComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        isCheckingBrowser: true
      }
    }

    componentDidMount() {
      checkIfTabAlreadyOpen((isTabAlreadyOpen) => {
        if(isTabAlreadyOpen) {
          alert('Homemade Arcade is open in another tab. Please check all tabs you have open. This tab will now shutdown')
          window.stop()
        } else {
          this.setState({
            isCheckingBrowser: false
          })
        }
      })
    }

    // // Our component just got updated
    // componentDidUpdate() {
    //   this.shouldNavigateAway();
    // }

    // //token ima auth nema, prepisi ga sa func component i useefect
    // shouldNavigateAway() {
    //     this.props.history.push('/');
    //   }
    // }

    render() {
      
      if(this.state.isCheckingBrowser) {
        return <Loader text="Checking Browser..."></Loader>
      } else {
        return <ChildComponent {...this.props} />;
      }

      
    }
  }

  function mapStateToProps(state) {
    return {}
  }

  return connect(mapStateToProps, { })(ComposedComponent);
};
