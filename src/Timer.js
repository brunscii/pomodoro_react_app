import React from 'react';
import './Timer.css';


class TimerSetter extends React.Component {

  static defaultProps = {
    timeType: 'session',
    time: 25
  };

  constructor(props) {
    super(props);
    this.state = {
      timeType: this.props.timeType,
      currentNumber: parseInt(props.time) > 0 ? parseInt(props.time) : 1
    };  
    this.reset = this.reset.bind(this);
  }

  reset(){
    this.setState(state=> ({
      timeType: this.props.timeType,
      currentNumber: parseInt(this.props.time) > 0 ? parseInt(this.props.time) : 1
    }));
  }

  getTime = function(){
    return this.state.time;
  }

  render(){
    return(
      <>
        <div className="time-label">
          <label id={this.props.label}>{this.props.timeType} Length:</label>
          <label className="time" id={this.props.timeType.toString().toLowerCase() +"-length"}>{this.state.currentNumber}</label>
        </div>
        <div className="plus-minus">
          
          <button className="bi bi-plus" id={this.props.timeType.toString().toLowerCase() + "-increment"} onClick={()=>{
            (this.state.currentNumber < 60 && this.setState(state=>({currentNumber: state.currentNumber + 1})) );
            (this.state.currentNumber < 60 && this.props.handleChange(this.state.timeType, this.state.currentNumber+1));
            }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg></button>
          
          
          <button className="bi bi-dash" id={this.props.timeType.toString().toLowerCase() + "-decrement"} onClick={()=>{
            
            {this.state.currentNumber > 1 && this.setState(state=>({currentNumber: state.currentNumber - 1})) }
            {this.state.currentNumber > 1 && this.props.handleChange(this.state.timeType, this.state.currentNumber-1)};
          }}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path></svg></button>
        </div>
      </>
    );
  }
};

class TimerDisplay extends React.Component {
  static defaultProps = {
    currentTime: 1500,
    timerState: 'Session',
    active: false
  }
  constructor(props){

    super(props);
    this.state = {
      breakTime: 5,
      sessionTime: 25,
      currentTime: props.currentTime,
      timerState: props.timerState,
      active: props.active
    }

    this.handleChange = this.handleChange.bind(this)
    this.beep = React.createRef();
    this.breakRef = React.createRef();
    this.sessionRef = React.createRef();
    this.breakCounter =   <TimerSetter timeType='Break' label="break-label" time={this.state.breakTime} handleChange={this.handleChange} ref={this.breakRef}/>;
    this.sessionCounter = <TimerSetter timeType='Session' label="session-label" time={this.state.sessionTime} handleChange={this.handleChange} ref={this.sessionRef}/>;
    this.renderTime = this.renderTime.bind(this);
    this.interval = null;
    this.reset = this.reset.bind(this);
    this.playBeep = this.playBeep.bind(this);
    this.playPause = this.playPause.bind(this);
    this.toggle = this.toggle.bind(this);
    this.tick = this.tick.bind(this);
  }

  handleChange(type,time){
    if(type.toLowerCase() == 'break'){
      this.setState(state=>({
        breakTime: time
      }))
      if(this.state.timerState.toLowerCase()=='break'){
        this.setState(state=>({
          currentTime:time*60
        }))
      }
    }
    if(type.toLowerCase() == 'session'){
      this.setState(state=>({
        sessionTime: time
      }))
      if(this.state.timerState.toLowerCase()=='session'){
        this.setState(state=>({currentTime: time*60}))
      }
    }
  }

  playBeep(){

    document.getElementById('time-left').innerText = "00:00"
    this.beep.current.currentTime=0;
    this.beep.current.play();
    
  }

  playPause(){
    
    if(!this.interval){
      this.interval = setInterval(this.tick, 1000);
      this.setState(state=>({active: true}))
    }else{
      clearInterval(this.interval);
      this.interval = null;
      this.setState(state=>({active:false}))
    }
    
  }

  reset (){

    
    this.setState({
      breakTime: 5,
      sessionTime: 25,
      currentTime: 1500,
      timerState: 'Session',
      active: false
    });

    clearInterval(this.interval);
    this.interval = null;
    this.breakRef.current.reset();
    this.sessionRef.current.reset();
    this.beep.current.pause();
    this.beep.current.currentTime=0;

  }


  renderTime(){
    let time = this.state.currentTime;
    return ( Math.floor((time/60)/10).toString() + Math.floor((time/60)%10).toString() + ":" + Math.floor((time%60)/10).toString() + Math.floor((time%60)%10)).toString();
  };

  toggle(){
    this.setState(state=>({
      timerState: (state.timerState == 'Session' ? 'Break' : 'Session'),
      currentTime: (state.timerState == 'Session' ? (this.state.breakTime*60) : (this.state.sessionTime *60))
    }));
  }

  tick (){

    if(this.state.active && this.state.currentTime > 1){
      this.setState(state=>({
        currentTime: state.currentTime - 1
      }));
    } 
    else {
      document.getElementById('time-left').innerText = '00:00';
      this.playPause()
      this.playBeep()
      this.toggle();
      this.playPause()
    }
  };

  render() {
    return (
      <div id='timer'>
        
        {this.breakCounter} 
        {this.sessionCounter}
        <div className='time-label' id='countdown'>
          <label id='timer-label'>{this.state.timerState}</label>
          <label className='time' id='time-left'>{this.renderTime()}</label>
        </div>
        <button id="start_stop" onClick={this.playPause}>Start/Stop</button>
        <button id="reset" onClick={this.reset}>RESET</button>
        <audio id='beep' ref={this.beep}>
          <source src='cyberpunk.mp3' type='audio/mpeg'/>
        </audio>
        
      </div>
    )
  }
}

  // export default Timer;
export default TimerDisplay;