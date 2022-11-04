import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Portfolio.scss';
import VideoWithControls from '../../../ui/VideoWithControls/VideoWithControls';
import ProjectHeader from '../ProjectHeader/ProjectHeader';
import Grid from '../../../ui/Grid/Grid';
import LightupImage from '../../../ui/LightupImage/LightupImage';
import Blockquote from '../../../ui/Blockquote/Blockquote';

window.barofdreamsAws = "https://wishlabs.s3.us-west-2.amazonaws.com/barofdreams"

const Portfolio = ({portfolio: { isVideoAudioPlay, isBackgroundMusicPlaying }}) => {
 return <div className="Portfolio">
    <div className="Portfolio__bar-of-dreams" id="#barofdreams">
      <ProjectHeader 
        title="Bar of Dreams: LA" 
        logoSrc={window.barofdreamsAws + '/logo.jpeg'}
        subtitle="The most ridiculous night of your life"
        websiteLink={"https://noproscenium.com/the-joy-of-waking-up-bar-of-dreams-los-angeles-review-ff4fc8637fa9"}
      />
      <Blockquote 
        cite="Cristen Brinkerhoff, Haunting, 2019"
        quote="Exactly the surrealist romp that’s been needed to bring comedic immersive theatre to the forefront of the medium."
        seeMoreLink={"https://www.haunting.net/bar-dreams-review/"}
      />
      <Grid container>
        {['/connie_outside.jpeg', '/press.jpeg', '/under_the_bar.jpeg', '/will_asleep.jpeg'].map((src) => {
          return <Grid key={src} xs={3}>
            <LightupImage className="w-full h-full" src={window.barofdreamsAws + src}/>
          </Grid>
        })}
      </Grid>
      <Blockquote 
        cite="Anthony Robinson, No Proscenium, 2019"
        quote="The four person audience is a clear collaborator in what occurs as it ventures into Will’s dreams of love, sadness and silliness. Every audience member gets a chance to shine, and to author a part of the absurdity of dream."
        seeMoreLink={"https://noproscenium.com/the-joy-of-waking-up-bar-of-dreams-los-angeles-review-ff4fc8637fa9"}
      />

      <VideoWithControls 
        videoSrc={window.barofdreamsAws + '/review_trailer_cut.mov'} 
        thumbnailSrc={window.barofdreamsAws + '/video_thumbnail.png'} 
        className="Portfolio__full-wide" 
        unmuteOnMouseEnter 
        autoPlay 
        loop 
        onUnmute={() => {

        }}
        onMute={() => {
          
        }}
      />
      <Blockquote 
        cite="Anthony Robinson, No Proscenium, 2019"
        quote="Bar of Dreams: LA manages to pack in as much charm (if not more) than many pop-ups and experiences sponsored by deeper pockets. The themes of friendship and self-love mark the show above many other things this year, as it’s one of the few immersive experiences that I came out with a sense of hope."
        seeMoreLink={"https://noproscenium.com/nopros-best-shows-experiences-of-2019-90178e1716de"}
      />
    </div>
 </div>
};

const mapStateToProps = (state) => ({
  portfolio: state.portfolio
});

export default compose(
  connect(mapStateToProps, { }))(Portfolio);
