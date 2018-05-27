import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';

let appWithStoreAndBrowser = 
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>;

ReactDOM.render(appWithStoreAndBrowser, document.getElementById('root'));
registerServiceWorker();
