import React from 'react';
import { connect } from 'react-redux';

import Task from '../components/Task';
//modal container for task modal dialog

const Fragment = React.Fragment;

class TaskContainer extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="card-body">
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                    <Task />
                </div>
                <div className="card-footer">
                    <button type="button" className="btn btn-link float-right"><i className="fas fa-plus"></i> Add task</button>
                </div>
            </Fragment>
        );
    }
}

export default TaskContainer