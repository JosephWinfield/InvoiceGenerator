import React from 'react'
import LineItem from './LineItem'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
  calcSubtotal,
  calcPercent,
  calcRate,
  calcTotal,
  calcBalanceDue
} from '../helpers/invoiceFormHelpers'

export default class InvoiceForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			number: 1,
			logo: '',
			to: '',
			from: '',
			date: moment(),
			paymentTerms: '',
			dueDate: moment(),
			balanceDue: 0,
			items: [{description: '',
							quantity: 0,
							rate: 0,
							amount: 0}],
			subtotal: 0,
			showTax: false,
			taxType: 'percent',
			tax: 0,
			showDiscount: false,
			discountType: 'percent',
			discount: 0,
			showShipping: false,
			shipping: 0,
			total: 0,
			amountPaid: 0,
			notes: '',
			terms: ''
		}

		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		const target = event.target;
		const name = target.name;

		const reader = new FileReader()
		let value = target.type === 'file' ? target.files[0] : target.value;

		if (value.type != undefined && value.type.includes('image')) {
			reader.addEventListener('load', () => {
				this.setState({
					logo: reader.result
				})
			})
			reader.readAsDataURL(value)
			return
		}

		if (value === 'true') {
			value = true
		} else if (value === 'false') {
			value = false
		} else {
			value
		}

		if ((name === 'tax' || name === 'discount' || name === 'shipping' || name === 'amountPaid') && (value === null || value === undefined || value === '')) {
			value = 0
		}

		if (typeof value === 'number') {
			this.setState({
				[name]: value
			})
		} else if (typeof(value) === 'boolean') {
			this.setState({
				[name]: value
			})
		} else if (value.match(/^\d+$/)) {
			this.setState({
				[name]: parseFloat(value)
			})
		} else {
			this.setState({
				[name]: value
			})
		}
	}

	render() {

		const subtotal = calcSubtotal(this.state.items)

		const rateDiscount = calcRate(
			this.state.discountType,
			this.state.discount,
			subtotal
		)

		const subSansDiscount = (subtotal - rateDiscount)

		const rateTax = calcRate(
			this.state.taxType,
			this.state.tax,
			subSansDiscount
		)

		const total = calcTotal(
			subtotal,
			rateTax,
			rateDiscount,
			this.state.shipping
		)

		let logo = null
		if (this.state.logo === '') {
			logo =<div className='logo-div'>
			 <label htmlFor='logo' className='flex-row flex-justify-center flex-align-center colored-button form-field-label '>
				+ Logo
			</label>
			<input
				name='logo'
				id='logo'
				type='file'
				accept='image/*'
				onChange={this.handleChange}
			/>
			</div>
		} else {
			logo = <div onClick={() => {this.setState({logo: ''})}}>
					<img className='logo-image' src={this.state.logo}/>
				</div>
		}

		let discount = null
		let discountButton = null

		if (!this.state.showDiscount ) {
			discountButton = <div className='discount-area flex-row flex-justify-end flex-align-center'>
				<button
				className='show-discount colored-link a-bit-of-space-below'
				onClick={this.handleChange}
				value='true'
				name='showDiscount'
				>
					+ discount
				</button>
			</div>
		} else if (this.state.showDiscount) {
			discount = <div className='discount-area flex-row flex-justify-end flex-align-center'>
				<div className='discount-type flex-row flex-justify-center flex-align-center'
				  onChange={this.handleChange}>
					<input
						type='radio'
						value='percent'
						name='discountType'
						id='discountTypePercent'
						defaultChecked
					/>
					<label htmlFor='discountTypePercent' className='form-field-label'>
						 %
					</label>
					<input
						type='radio'
						value='flat'
						name='discountType'
						id='discountTypeFlat'
					/>
					<label htmlFor='discountTypeFlat' className='form-field-label'>
						$
					</label>
				</div>
				<div className='discount-field flex-column'>
					<label htmlFor='discount' className='form-field-label'>
						Discount
					</label>
					<input
						className='form-field-input more-space-below'
						name='discount'
						type='number'
						min='0'
						onChange={this.handleChange}
					/>
				</div>
				<button
					onClick={(e) => {
						this.handleChange(e)
						this.setState({discount: 0})
					}}
					value='false'
					name='showDiscount'
					className='hide-discount colored-button'
				>
					x
				</button>
			</div>
			discountButton = null
		}

		let tax = null
		let taxButton = null

		if (!this.state.showTax) {
			taxButton = <div className='tax-area flex-row flex-justify-end flex-align-center'>
				<button
				className='show-tax colored-link a-bit-of-space-below'
				onClick={this.handleChange}
				value='true'
				name='showTax'
				>
					+ tax
				</button>
			</div>
		} else if (this.state.showTax) {
			tax = <div className='tax-area flex-row flex-justify-end flex-align-center'>
				<div className='tax-type flex-row flex-justify-center flex-align-center'
					onChange={this.handleChange}
					>
					<input
						type='radio'
						value='percent'
						name='taxType'
						id='taxTypePercent'
						defaultChecked
						/>
					<label htmlFor='taxTypePercent' className='form-field-label'>
						%
					</label>
					<input
						type='radio'
						value='flat'
						name='taxType'
						id='taxTypeFlat'
						/>
					<label htmlFor='taxTypeFlat' className='form-field-label'>
						$
					</label>
				</div>
				<div className='tax-field flex-column'>
					<label htmlFor='tax' className='form-field-label'>
						Tax
					</label>
					<div className='flex-row'>
						<span className='align-type'>%</span>
						<input
							className='form-field-input more-space-below'
							name='tax'
							type='number'
							min='0'
							onChange={this.handleChange}
						/>
					</div>
				</div>
				<button
					onClick={(e) => {
						this.handleChange(e)
						this.setState({tax: 0})
					}}
					value='false'
					name='showTax'
					className='hide-tax colored-button'
				>
					x
				</button>
			</div>
			taxButton = null
		}

		let shipping = null
		let shippingButton = null

		if (!this.state.showShipping) {
			shippingButton = <div className='shipping-field flex-column flex-justify-end flex-align-center'>
				<button
				className='show-shipping colored-link a-bit-of-space-below'
				onClick={this.handleChange}
				value='true'
				name='showShipping'
				>
					+ shipping
				</button>
			</div>
			shipping = null
		} else if (this.state.showShipping) {
			shipping = <div className='shipping-field flex-row flex-justify-end flex-align-center'>
				<div className='flex-column'>
					<label htmlFor='shipping' className='form-field-label'>
						Shipping
					</label>
					<input
						className='form-field-input more-space-below'
						name='shipping'
						type='number'
						min='0'
						onChange={this.handleChange}
					/>
				</div>
				<button
					onClick={(e) => {
						this.handleChange(e)
						this.setState({shipping: 0})
					}}
					className='hide-shipping colored-button'
					value='false'
					name='showShipping'
				>
					x
				</button>
			</div>
			shippingButton = null
		}



		return (
			<form onSubmit={(e) => {
				e.preventDefault()
				if (this.state.to === '' || this.state.to === '') {
					return
				} else {
					this.props.onSend({
            from: (this.state.from).match(/.{1,20}/g)[0],
            to: (this.state.to).match(/.{1,20}/g)[0],
						subject: `Invoice #${this.state.number}`
          })
				}
				}
			}>
				<div className='wrapper flex-column'>
					<div className='invoice-header flex-column'>
						<div className='top flex-row flex-space-between flex-align-center'>
							<div className='column-left flex-column flex-justify-center'>
								<h1>Invoice</h1>

								<label htmlFor='number' className='number-label form-field-label'>
									<span className='label-position'>#</span>
									<input
										className='form-field-input'
										name='number'
										className='text-center form-field-input'
										onChange={this.handleChange}
										value={this.state.number}
									/>
								</label>
							</div>

							{logo}

						</div>
						<div className='two-col-row flex-column'>
							<div className='two-col-left flex-column'>
								<label htmlFor='from' className='form-field-label'>
									From
								</label>
								<textarea
									className='form-field-input form-field-multiline'
									name='from'
									onChange={this.handleChange}
								/>

								<label htmlFor='to' className='form-field-label'>
									Bill To
								</label>
								<textarea
									className='form-field-input form-field-multiline'
									name='to'
									onChange={this.handleChange}
								/>
							</div>
							<div className='two-col-right flex-column'>
								<span className='form-field-label'>
									Date
								</span>
								<DatePicker
									className='form-field-input cursor-pointer'
									selected={this.state.date}
									onChange={(date) => this.setState({date: date}) }
									name='dueDate'
									showMonthDropdown
								 />

								<label htmlFor='paymentTerms' className='form-field-label'>
									Payment Terms
								</label>
								<div className='flex-row'>
									<input
										className='form-field-input'
										name='paymentTerms'
										onChange={this.handleChange}
									/>
								</div>

								<span className='form-field-label'>
									Due Date
								</span>
								<DatePicker
									className='form-field-input cursor-pointer'
									selected={this.state.dueDate}
									onChange={(date) => this.setState({dueDate: date}) }
									name='dueDate'
									showMonthDropdown
								 />

								<span className='color-larger-text'>
								 	Balance Due: ${calcBalanceDue(total, this.state.amountPaid)}
								</span>
							</div>
						</div>
					</div>
					<div className='top-border flex-column'>
						<ul className='line-item-list'>
							{this.state.items.map((item, index) => {
								return (
									<LineItem
										description={item.description}
										quantity={item.quantity}
										rate={item.rate}
										amount={item.rate * item.quantity}
										key={index}
										length={this.state.items.length}
										onChange={ (name, value) => {
											const newItems = this.state.items.slice()

											newItems[index] = {
												description: item.description,
												quantity: item.quantity,
												rate: item.rate,
												amount: (item.rate * item.quantity)
											}

											if (name === 'quantity' || name === 'rate') {
												value = value === '' ? 0 : parseFloat(value)
											}
											newItems[index][name] = value

											this.setState({
												items: newItems
											});
										}}
										onRemove={()=>{
											const newItems = this.state.items.slice()
											newItems.splice(index, 1)
											this.setState({
												items: newItems
											})
										}}
									/>)
								})
							}
						</ul>
						<div className='flex-row'>
							<button
								className='add-line-item colored-button'
								onClick={(event)=>{
									event.preventDefault()
									const newLineItem = this.state.items.slice()
									newLineItem.push({
										description: '',
										quantity: 0,
										rate: 0,
										amount: 0
									})
			            this.setState({
	                	items: newLineItem
		              });
								}}>
								+ Line Item
							</button>
						</div>
					</div>

					<div className='two-col-row invoice-footer flex-column'>
						<div className='flex-column two-col-right flex-space-between'>
							<span className='self-align-end medium-weight-text'>
								Subtotal: ${calcSubtotal(this.state.items)}
							</span>

							{discount}

							{tax}

							{shipping}

							<div className='flex-column flex-align-end'>
								{discountButton}
								{taxButton}
								{shippingButton}
							</div>

							<div className='total-field flex-row flex-justify-end'>
								<span>Total: ${total}</span>
							</div>

							<div className='amount-paid-field flex-row flex-justify-end'>
								<div className='flex-column'>
									<label htmlFor='amountPaid' className='form-field-label'>
										Amount Paid
									</label>
									<input
										className='form-field-input'
										name='amountPaid'
										type='number'
										min='0'
										onChange={this.handleChange}
									/>
								</div>
							</div>
						</div>
						<div className='notes-terms flex-column two-col-left'>
							<label htmlFor='notes' className='form-field-label'>
								Notes
							</label>
							<textarea
								className='form-field-input form-field-multiline'
								name='notes'
								onChange={this.handleChange}
							/>

							<label htmlFor='terms' className='form-field-label'>
								Terms
							</label>
							<textarea
								className='form-field-input form-field-multiline'
								name='terms'
								onChange={this.handleChange}
							/>
						</div>
					</div>
				</div>
				<div className='footer flex-row flex-justify-end'>
					<div className='footer-buttons flex-row flex-justify-end'>
						<input type='submit' className='submit colored-button'/>
						<button className='colored-button'
							onClick={(e)=>{
								e.preventDefault()
							}}
						>
							Download Invoice
						</button>
					</div>
				</div>
			</form>


		)
	}

}
