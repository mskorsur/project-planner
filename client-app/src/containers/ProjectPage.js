import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ProjectContainer from './ProjectContainer';
import AllProjects from './AllProjects';

class ProjectPage extends React.Component {
    render() {
        return (
            <main role="main" className="container mt-5">
                <Switch>
                    <Route path={`${this.props.match.path}/all`} exact component={AllProjects} />
                    <Route path={`${this.props.match.path}/:projectId`} component={ProjectContainer} />
                </Switch>
            </main>
        );
    }
}

export default ProjectPage