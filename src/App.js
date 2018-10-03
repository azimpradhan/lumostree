import React, { Component } from 'react';
import Tree from './Components/Tree';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="App">
            <header className="App-header">
              <h1 className="App-title">Welcome to Lumos Tree</h1>
            </header>
            <div>
              <Switch>
                <Route exact path="/new" component={Tree} />
                <Route exact path="/:id" component={Tree} />} />
                <Route exact path="/:id/edit" component={Tree} />} />
              </Switch>
            </div>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
