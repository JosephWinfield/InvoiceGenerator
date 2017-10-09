import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Form from './components/Form'

import 'react-datepicker/dist/react-datepicker.css'
import 'normalize.css'
import './main.css'

ReactDOM.render(
	<Form/>,
	document.querySelector('.app')
)
