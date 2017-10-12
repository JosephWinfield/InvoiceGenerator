import React from 'react'

export default class EmailForm extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			recipient: '',
			sender: '',
			subject: '',
			messageBody: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const target = event.target
		const name = target.name
		const value = target.value

		this.setState({
			[name]: value
		})
	}

	render () {
		return (
			<div className='modal-wrapper'>
				<form className='modal-body'>
					<div
						className='colored-button square-width remove-padding'
						onClick={() => {this.props.onClose()}}>
						X
					</div>
					<div className='flex-column fill-screen flex-space-between'>
						<div className='flex-column'>
							<label className='form-field-label'>
								To
							</label>
							<div className='flex-row flex-align-center'>
								<span className='input-facade border-box'>
									{this.props.to}
								</span>
								<input
									name='recipient'
									className='form-field-input remove-margin-bottom fill-space remove-left-border-radius border-box'
									onChange={this.handleChange}
								/>
							</div>
						</div>
						<span className='form-field-label'>
							We promise to never spam your client's email address. We hate spam just as much as you
						</span>

						<div>
							<label className='form-field-label'>
								From
							</label>
							<div className='flex-row flex-align-center'>
								<span className='input-facade border-box'>
									{this.props.from}
								</span>
								<input
									name='sender'
									className='form-field-input remove-margin-bottom fill-space remove-left-border-radius border-box'
									onChange={this.handleChange}
								/>
							</div>
						</div>

						<span className='form-field-label'>
							You will receive a delivery confirmation with a copy of your invoice.
						</span>

						<div className='flex-column'>
							<label className='form-field-label'>
								Subject
							</label>
							<div className='flex-row flex-align-center'>
								<input
									name='subject'
									className='form-field-input remove-margin-bottom fill-space'
									onChange={this.handleChange}
									defaultValue={`${this.props.subject} from ${this.props.from}`}
								/>
							</div>
						</div>

						<div className='flex-column'>
							<label className='form-field-label'>
								Message
							</label>
							<textarea
								name='messageBody'
								className='form-field-input form-field-multiline fill-space min-height'
								onChange={this.handleChange}
								defaultValue={`Hi,

A new invoice has been created on your account. You may find a PDF of your invoice attached.

Thank you for your business!`}
							/>
						</div>

						<button
		          onClick={() => {
		            this.props.onClose()
		          }}
							className='colored-button'
		        >
		          Send
		        </button>
					</div>
				</form>
			</div>
		)
	}
}
