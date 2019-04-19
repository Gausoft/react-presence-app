import React, { Component } from 'react';
import Employees from './components/Employees';
import Search from './components/Search';

class App extends Component {
  render() {
    return (
      <div>
        <Search />
        <Employees />
      </div>
    );
  }
}

export default App;
