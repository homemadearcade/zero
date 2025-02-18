import classNames from 'classnames';
import React from 'react';
import Sketch from 'react-p5';
import './Constellation.scss'

const stars = 350

export class Constellation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.xVel = Array(stars);
    this.yVel = Array(stars);
    this.xPos = Array(stars);
    this.yPos = Array(stars);
    this.s = Array(stars);
    this.a = 0;
    this.b = 0;
    this.c = 100;
    this.p = 10;
    this.sf = 1;
    this.width = props.width ? props.width : (window.innerWidth - 2);
    this.height = props.height ? props.height : (window.innerHeight - 2);
    this.zoom = 1;
    this.maxZoom = 32;
  }

	setup = (p5, parentRef) => {
    if(this.props.zoomOut) { 
      this.zoom = this.maxZoom
    }

		p5.createCanvas(this.width, this.height).parent(parentRef);
    // size(this.width, 600);

    for (let i=0; i < stars; i++) {
      this.xPos[i] = p5.random(1, this.width);
    }

    for (let i=0; i < stars; i++) {
      this.yPos[i] = p5.random(1, this.height -1);
    }

    for (let i=0; i < stars; i++) {
      this.xVel[i] = p5.random(-10, 10);
    }

    for (let i=0; i < stars; i++) {
      this.yVel[i] = p5.random(-10, 10);
    }
    for (let i=0; i < stars; i++) {
      this.s[i] = p5.random(1, 4);
    }
	};

	draw = (p5) => {
    if(this.props.zoomOut) {
      if(this.zoom > 1) this.zoom -= (this.maxZoom/200)
      else this.zoom = 1

      const multiplier = (this.zoom - 1)/(this.maxZoom - 1)
      const sizeMultiplier = this.maxZoom/2.2
      p5.translate(((-this.width ) * sizeMultiplier) * multiplier , ((-this.height) * sizeMultiplier) * multiplier )
      p5.scale(this.zoom)
    }

    p5.background(0);
    p5.fill(255);
    if(this.zoom <= 1) this.tracker(p5);

    for (let i=0; i < stars; i++) {
      p5.noStroke();
      p5.rect(this.xPos[i], this.yPos[i], this.s[i], this.s[i]);
    }
	};

  tracker(p5) {
    p5.smooth ();
    //stroke(255);
    p5.noStroke ();
    p5.line (this.a, this.b, this.c, this.a);
    this.a = this.a + 3;

    if (this.a >= this.height) {
      this.a = 0;
      this.c = this.c +100;
      this.b = this.b +100;
    }

    p5.stroke (255);

    for (let i=0; i < stars; i++) {
      p5.line (this.xPos[i]+this.p, this.yPos[i], this.xPos[i], this.yPos[i]);
      p5.line (this.xPos[i], this.yPos[i]+this.p, this.xPos[i], this.yPos[i]);
      p5.line (this.xPos[i], this.yPos[i], this.xPos[i]-this.p, this.yPos[i]);
      p5.line (this.xPos[i], this.yPos[i], this.xPos[i], this.yPos[i]-this.p);
      if (this.a > this.yPos[i]-25) {
        this.p = 5;
      }
      if (this.a < this.yPos[i]+25) {
        this.p = 5;
      }
      if (this.a < this.yPos[i]-25) {
        this.p = 0;
      }
      if (this.a > this.yPos[i]+25) {
        this.p = 0;
      }
      i = i + 1;
    }
  }

  mouseMoved = (p5, event) => {
    if(this.props.zoomOut) return 
    if(this.props.notInteractive) return

    const { clientX: mouseX, clientY: mouseY } = event

    
    for (let i=0; i < stars; i++) {
      if (p5.dist(mouseX, mouseY, this.xPos[i], this.yPos[i]) < 100) {
        this.xPos[i] = this.xPos[i] + p5.random(100);
        this.yPos[i] = this.yPos[i] - p5.random(100);
        this.xPos[i] = this.xPos[i] - p5.random(100);
        this.yPos[i] = this.yPos[i] + p5.random(100);

        if (this.xPos[i] < 0 || this.xPos[i] > this.width) {
          this.xPos[i] = p5.random(this.width);
        }

        if (this.yPos[i] < 0 || this.yPos[i] > this.height) {
          this.yPos[i] = p5.random(this.height);
        }
      }


      //    stroke(random(100, 200), random(100, 200), random(200, 255), 40);
      p5.line(mouseX, mouseY, this.xPos[i], this.yPos[i]);
    }
  }

  mouseDragged = (p5, event) => {
    if(this.props.zoomOut) return 
    if(this.props.notInteractive) return


    const { clientX: mouseX, clientY: mouseY } = event

    for (let i=0; i < stars; i++) {
      if (p5.dist(mouseX, mouseY, this.xPos[i], this.yPos[i]) > 150) {
        this.xPos[i] = this.xPos[i] - p5.random(100);
        this.yPos[i] = this.yPos[i] + p5.random(100);
        this.xPos[i] = this.xPos[i] + p5.random(100);
        this.yPos[i] = this.yPos[i] - p5.random(100);

        if (this.xPos[i] < 0 || this.xPos[i] > this.width) {
          this.xPos[i] = p5.random(this.width);
        }

        if (this.yPos[i] < 0 || this.yPos[i] > this.height) {
          this.yPos[i] = p5.random(this.height);
        }
      }


      p5.stroke(100, 200, stars, 40);
      p5.line(mouseX, mouseY, this.xPos[i], this.yPos[i]);
    }
  }

  componentDidMount() {
    this.setState({
      startZoom: true
    })
  }

	render() {
		return <div className={classNames("Constellation", this.props.className)}>
      <Sketch setup={this.setup} draw={this.draw} mouseDragged={this.mouseDragged} mouseMoved={this.mouseMoved} />
      <div className="Constellation__content">
        {this.props.children}
      </div>
      {this.props.zoomOutImage && <>
        <img className={classNames("Constellation__zoom-out-image", { 'shrink':  this.state.startZoom } )} alt="zooming out game" src={this.props.zoomOutImage}/>
        <div className={classNames("Constellation__zoom-out-image", { 'shrink starify':  this.state.startZoom } )}/>
      </>}
    </div>
	}
}
