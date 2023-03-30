import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Portfolio.scss';
import VideoWithControls from '../../../ui/VideoWithControls/VideoWithControls';
import ProjectHeader from '../ProjectHeader/ProjectHeader';
import Grid from '../../../ui/Grid/Grid';
import LightupImage from '../../../ui/LightupImage/LightupImage';
import Blockquote from '../../../ui/Blockquote/Blockquote';
import BlockText from '../../../ui/BlockText/BlockText';
import { muteVideoAudio, unmuteVideoAudio } from '../../../store/actions/marketing/portfolioActions';

window.barofdreamsAws = "https://wishlabs.s3.us-west-2.amazonaws.com/barofdreams"
window.supducksAws = "https://wishlabs.s3.us-west-2.amazonaws.com/supducks"

const Portfolio = ({muteVideoAudio, unmuteVideoAudio}) => {
  
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
          return <Grid key={src} xs={6} md={3}>
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
        onMute={() => {
          muteVideoAudio()
        }}
        onUnmute={() => {
          unmuteVideoAudio()
        }}
      />
      <Blockquote 
        cite="Anthony Robinson, No Proscenium, 2019"
        quote="Bar of Dreams: LA manages to pack in as much charm (if not more) than many pop-ups and experiences sponsored by deeper pockets. The themes of friendship and self-love mark the show above many other things this year, as it’s one of the few immersive experiences that I came out with a sense of hope."
        seeMoreLink={"https://noproscenium.com/nopros-best-shows-experiences-of-2019-90178e1716de"}
      />
    </div>
    <div className="Portfolio__supducks" id="#supducks">
      <ProjectHeader 
        title="SupDucks" 
        logoSrc={window.supducksAws + '/chip_wackified.jpeg'}
        subtitle="A quacky art collective traveling through the metaverse"
        websiteLink={"https://supducks.com"}
      />
    </div>
    <BlockText text="SupDucks is a collaborative community of over 40,000 people that build the world of The Pond, the stories of the King Frogs, the legends of the MegaToads, and the music and artwork of the Boardwalk. Anyone has the power to buy the intellectual property rights of characters and locations within the universe and make them their own."/>
    <Grid container>
        {['/frankynines.webp','/veecon.webp', '/mural.png', '/opensea.png'].map((src) => {
          return <Grid key={src} xs={6} md={3}>
            <LightupImage className="w-full h-full" src={window.supducksAws + src}/>
          </Grid>
        })}
      </Grid>
      <Blockquote 
        cite="Franky Nines, 2022"
        quote="I love to have fun and am a jokester on about everything. My art is a way for me to truly express myself. And with that, I love to make art that strikes emotion of joy, love, fear and laughter."
        seeMoreLink={"https://shoutoutla.com/meet-franky-nines-artist-founder-supducks/"}
      />
    <VideoWithControls 
      videoSrc={window.supducksAws + '/finalcompressed.mp4'} 
      className="Portfolio__full-wide" 
      unmuteOnMouseEnter 
      autoPlay 
      loop 
      onMute={() => {
        muteVideoAudio()
      }}
      onUnmute={() => {
        unmuteVideoAudio()
      }}
    />
 </div>
};

const mapStateToProps = (state) => ({});

export default compose(
  connect(mapStateToProps, { muteVideoAudio, unmuteVideoAudio }))(Portfolio);
