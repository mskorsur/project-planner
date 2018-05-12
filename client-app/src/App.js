import React from 'react';

import Navbar from './components/Navbar';
import ProjectPage from './containers/ProjectPage';

class App extends React.Component {
    render() {
      return (
        <div>
          <Navbar />
          <ProjectPage /> 
        </div>
      );
    }
}

export default App;
