import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const mapStateToProps = state => {
    const userId = state.currentUser;
    const userProjects = state.users.byId[userId].projects;
    return {
        currentUserProjects: selectCurrentUserProjects(state.projects.byId, userProjects)
    }
}

const selectCurrentUserProjects = (stateProjects, userProjects) => {
    return userProjects.map(project => {
        return stateProjects[project];
    });
}

class AllProjects extends React.Component {
    renderCurrentUserProjects = () => {
        return (
            <table className="table">
                <thead className="thead-light">
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cards</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderProjectDataAsTableRow()}
                </tbody>
            </table>
        );
    }

    renderProjectDataAsTableRow = () => {
        return this.props.currentUserProjects.map((project, index) => {
            return (
                <tr key={project.id}>
                    <th scope="row" className="h5 font-weight-bold">{index + 1}</th>
                    <td className="h5"><Link to={`/project/${project.id}`}>{project.name}</Link></td>
                    <td className="h5 text-capitalize">{project.status}</td>
                    <td className="h5">{project.cards.length}</td>
                </tr>
            );
        });
    }

    render() {
        return (
            <Fragment>
                <h2 className="heading-weight heading-color">All Projects</h2>
                <div className="row mt-4">
                    {this.renderCurrentUserProjects()}
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(AllProjects)