import React, { useEffect, useState, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';

import './WishLabsPage.scss';
import ShootingStarSky from '../../app/wishLabs/ShootingStarSky/ShootingStarSky';
import { Fade, Slide } from '@mui/material';
import classNames from 'classnames';
import Portfolio from '../../app/wishLabs/Portfolio/Portfolio';
import JumboDescription from '../../app/wishLabs/JumboDescription/JumboDescription';
import Typography from '../../ui/Typography/Typography';
import Icon from '../../ui/Icon/Icon';

const WishLabsPage = ({ }) => {
  const [isScrollabe, setIsScrollable] = useState(false)
  const [slideIn, setSlideIn] = useState(false)

  const shootStarSkyRef = useRef(null)
  const contentRef = useRef(null)

  const [mouse, setMouse] = useState({x: 0, y: 0})

  useEffect(() => {
    setTimeout(() => {
      setSlideIn(true)
    }, 3500)
  
    setTimeout(() => {
      setIsScrollable(true)
    }, 3800)

    function onMouseMove({ clientX, clientY }) {
      setMouse({x: clientX, y: clientY})
    }

    window.addEventListener('mousemove', onMouseMove)

    function fadeOutOnScroll(event) {
      const element = event.target

      if (!element) {
        return;
      }

      var distanceToTop = window.pageYOffset + element.getBoundingClientRect().top;
      var elementHeight = element.offsetHeight;
      var scrollTop = element.scrollTop;
      
      var opacity = 1;
      
      if (scrollTop > distanceToTop) {
        opacity = 1 - ((scrollTop - 0) / elementHeight);
      }
      
      if (opacity >= 0) {
        shootStarSkyRef.current.style.opacity = opacity;
      }
    }

    contentRef.current.addEventListener('scroll', fadeOutOnScroll)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      contentRef.current.removeEventListener('scroll', fadeOutOnScroll);
    }
    
  })

  function getCurrentRGB() {
    // let r = 6;
    // let g = 2;
    // let b = 18

    // let r2 = 6;
    // let g2 = 2;
    // let b2 = 18

    // r += (mouse.x + mouse.y) % 30
    // g += (mouse.y) % 30
    // b += (mouse.x) % 30

    // r2 += (mouse.x - mouse.y) % 30
    // g2 += (mouse.y * mouse.x) % 30
    // b2 += (mouse.x + mouse.y * 2) % 30


    let r = (mouse.x/10) + 0;
    let g = 99 - (mouse.y/5);
    let b = 99 - ((mouse.x + mouse.y)/15);
    
    r = Math.floor(r);
    g = Math.floor(g);
    b = Math.floor(b);
    
    let r2 = (mouse.x/20) + 0;
    let g2 = (mouse.y/20) + 183;
    let b2 = ((mouse.x + mouse.y)/60) + 95;
          
    r2 = Math.floor(r2);
    g2 = Math.floor(g2);
    b2 = Math.floor(b2);

    return `rgba(${g}, ${g}, ${b}, .1)`

    return `linear-gradient(rgba(${g}, ${g}, ${b}, .6),rgba(${g2}, ${g2}, ${b2}, 0.8))`
  }


  return <div className="WishLabsPage">
    <Fade in timeout={{ enter: 800 }}>
      <div 
        ref={contentRef}
        className={classNames("WishLabsPage__content", { 'WishLabsPage__content--ready': isScrollabe })}
        style={{ backgroundColor: getCurrentRGB() }}
      >
        <div className="WishLabsPage__shooting-star" ref={shootStarSkyRef}><ShootingStarSky/></div>
        <div className="WishLabsPage__portfolio">
          <Fade style={{ transitionDelay: '2000ms' }} timeout={{ enter: 1200 }} in><div className="WishLabsPage__block">
            <JumboDescription/>
            <Fade style={{ transitionDelay: '6000ms' }} timeout={{ enter: 1200 }} in><div><Icon className="bounce WishLabsPage__scroll-down" icon="faChevronDown" size="sm"></Icon></div></Fade>
          </div></Fade>
          <div className="WishLabsPage__block"></div>
          <Portfolio/>
        </div>
      </div>
    </Fade>
    <Slide timeout={{ enter: 1200 }} in={slideIn} direction="up"><div className="WishLabsPage__footer">
      <Typography component="h1" variant="div">Wish Labs</Typography> 
      <div className="WishLabsPage__links">
        <Link to="/">Bar of Dreams</Link>
        <Link to="/">Homemade Arcade</Link>
        <Link to="/">SupDucks</Link>
        <Link to="/">Previous Works</Link>
      </div>
    </div>
    </Slide>
  </div>
};

const mapStateToProps = (state) => ({

});

export default compose(connect(mapStateToProps, { }))(WishLabsPage);
