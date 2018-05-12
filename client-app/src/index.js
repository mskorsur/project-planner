import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { store } from './redux/store';
import registerServiceWorker from './registerServiceWorker';

let appWithReduxStore = 
    <Provider store={store}>
        <App />
    </Provider>;

ReactDOM.render(appWithReduxStore, document.getElementById('root'));
registerServiceWorker();
