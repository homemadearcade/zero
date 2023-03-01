import { useEffect } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { confetti } from 'tsparticles-confetti'

      // shapes: ["image"],
      // shapeOptions: {
      //   image: Object.keys(gameModel.awsImages).map((awsImageId) => {
      //     const awsImageData = gameModel.awsImages[awsImageId]
      //     return {
      //       src: window.awsUrl + awsImageData.url,
      //       width: 32,
      //       height: 32
      //     }
      //   })
      // },

      //       shapes: ['square'],
      // colors: Object.keys(gameModel.colors)
function ParticlesTest({ element, gameModel: { gameModel} }) {
  useEffect(() => {
    confetti({
      spread: 360,
      ticks: 200,
      gravity: 1,
      decay: 0.94,
      startVelocity: 30,
      particleCount: 100,
      scalar: 3,
      shapes: ['square'],
      colors: ['#333', '#222', '#000']
    });
  }, [])
}

const mapStateToProps = (state) => ({
  gameModel: state.gameModel
});

export default compose(
  connect(mapStateToProps, {  }),
)(ParticlesTest);
