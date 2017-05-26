import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Clicker extends React.Component {
	render() {
		return (
			<div onClick={this.props.handleClick}> {this.props.count} </div>
		);
	}
}

class App extends Component {
  constructor() {
    super();
    this.state = { counts: [0, 0, 0, 0, 0, 0, 0, 0] };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    const copy = this.state.counts.slice();
    // const value = 0;
    copy[i] += 1;
    this.setState({counts: copy});
  }

  render() {
    const clickers = this.state.counts.map((count, i) => {
      return <Clicker key={i} handleClick={() => {this.handleClick(i)}} count = {count}/>
    });
		return (
			<div>
        <h1> Clicker! </h1>
        {clickers}
      </div>
		);
	}
}

export default App;
