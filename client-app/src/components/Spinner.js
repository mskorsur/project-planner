import React from 'react';

class Spinner extends React.Component {
    render() {
        return (
            <div className="mt-5 spinner">
                <div className="text-center text-secondary">
                    <i className="fas fa-spinner fa-spin fa-5x"></i>
                </div>
                <div className="mt-3 alert alert-secondary text-center" role="alert">
                    <p className="h5">Loading ...</p>
                </div>
            </div>
        );
    }
}

export default Spinner