import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import StatusFilterSelect from '../components/StatusFilterSelect';

const mapStateToProps = state => {
    const userId = state.currentUser;
    const userProjects = state.users.byId[userId].projects;
    return {
        currentUserProjects: selectCurrentUserProjects(state.projects.byId, userProjects),
        statusFilter: state.ui.statusFilter
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
        const filteredProjects = this.filterProjectsBasedOnStatusFilter(this.props.currentUserProjects, this.props.statusFilter);
        return filteredProjects.map((project, index) => {
            return (
                <tr key={index}>
                    <th scope="row" className="h5 font-weight-bold">{index + 1}</th>
                    <td className="h5"><Link to={`/project/${project.id}`}>{project.name}</Link></td>
                    <td className="h5 text-capitalize">{project.status}</td>
                    <td className="h5">{project.cards.length}</td>
                </tr>
            );
        });
    }

    filterProjectsBasedOnStatusFilter = (projects, statusFilter) => {
        if (statusFilter === 'All') {
            return projects;
        }

        return projects.filter(project => project.status === statusFilter);
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-10">
                        <h2 className="heading-weight heading-color">All Projects</h2>
                    </div>
                    <div className="col-md-2">
                        <StatusFilterSelect />
                    </div>
                </div>
                <div className="row mt-4">
                    {this.renderCurrentUserProjects()}
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps)(AllProjects)