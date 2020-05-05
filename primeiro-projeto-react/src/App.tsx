import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import GlobalStyles from './styles/global';

const App: React.FC = () => (
  <>
    <Router>
      <Routes />
    </Router>
    <GlobalStyles />
  </>
);
export default App;
