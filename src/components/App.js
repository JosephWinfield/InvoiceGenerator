import React from 'react'

import InvoiceForm from './Form'
import EmailForm from './Email'

export default class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			showEmailModal: false,
			invoiceProps: null
		}
	}

	render() {
		let modal = null

		if (this.state.showEmailModal) {
			modal = (
				<EmailForm
					from={this.state.invoiceProps.from}
					to={this.state.invoiceProps.to}
					subject={this.state.invoiceProps.subject}
					onClose={() => {
						this.setState({
							showEmailModal: false,
							invoiceProps: null
						})
					}}
				/>
			)
		}

		return (
			<div>
				<InvoiceForm
					onSend={(invoiceProps) => {
						this.setState({
							showEmailModal: true,
							invoiceProps: invoiceProps
						})
					}}
				/>
				{modal}
			</div>
		)
	}
}
