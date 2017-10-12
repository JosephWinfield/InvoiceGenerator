import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'

import 'react-datepicker/dist/react-datepicker.css'
import 'normalize.css'
import './main.css'

ReactDOM.render(
	<App/>,
	document.querySelector('.app')
)
