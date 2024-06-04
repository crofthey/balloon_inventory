import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Overview from './pages/Overview';
import AddStock from './pages/AddStock';
import UseStock from './pages/UseStock';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Overview} />
        <Route path="/add-stock" component={AddStock} />
        <Route path="/use-stock" component={UseStock} />
      </Switch>
    </Router>
  );
}

export default App;
