import React from 'react'
import LineItem from './LineItem'
import DatePicker from 'react-datepicker'
import moment from 'moment'


const calcSubtotal = (items) => {
	return items.reduce((total,item) => {
		return total + (item.rate * item.quantity)
	}, 0)
}

const calcPercent = (percentAmount, subTotal) => {
	return (percentAmount / 100) * subTotal
}

const calcRate = (type, amount, subTotal) => {
	if (type === 'percent') {
		return calcPercent(amount, subTotal)
	} else if (type === 'flat') {
		return amount
	} else {
		throw new Error('Unrecognized Type')
	}
}

const calcTotal = (subTotal, tax, discount, shipping) => {
	return (parseFloat((subTotal  - discount) + tax + shipping).toFixed(2))
}

const calcBalanceDue = (total, amountPaid) => {
	return (total - amountPaid).toFixed(2)
}

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

	setSelection(value, field) {
		this.setState({
			[field]: value
		})
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
			 <label htmlFor='logo' className='logo'>
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
			logo = <div className='logo-div'  onClick={() => {this.setSelection('', 'logo')}}>
				<img src={this.state.logo}/>
				</div>
		}

		let discount = null
		let discountButton = null

		if (!this.state.showDiscount ) {
			discountButton = <div className='discount-area'>
				<button
				className='show-discount'
				onClick={this.handleChange}
				value='true'
				name='showDiscount'
				>
					+ discount
				</button>
			</div>
		} else if (this.state.showDiscount) {
			discount = <div className='discount-area'>
				<div className='discountType' onChange={this.handleChange}>
					<input
						type='radio'
						value='percent'
						name='discountType'
						id='discountTypePercent'
						defaultChecked
					/>
					<label htmlFor='discountTypePercent'>
						 %
					</label>
					<input
						type='radio'
						value='flat'
						name='discountType'
						id='discountTypeFlat'
					/>
					<label htmlFor='discountTypeFlat'>
						$
					</label>
				</div>
				<div className='discount-field'>
					<label htmlFor='discount'>
						Discount
					</label>
					<input
						name='discount'
						type='number'
						min='0'
						onChange={this.handleChange}
					/>
				</div>
				<button
					onClick={(e) => {
						this.handleChange(e)
						this.setSelection(0, 'discount')
					}}
					value='false'
					name='showDiscount'
					className='hide-discount'
				>
					x
				</button>
			</div>
			discountButton = null
		}

		let tax = null
		let taxButton = null

		if (!this.state.showTax) {
			taxButton = <div className='tax-area'>
				<button
				className='show-tax'
				onClick={this.handleChange}
				value='true'
				name='showTax'
				>
					+ tax
				</button>
			</div>
		} else if (this.state.showTax) {
			tax = <div className='tax-area'>
				<div className='taxType'
					onChange={this.handleChange}
					>
					<input
						type='radio'
						value='percent'
						name='taxType'
						id='taxTypePercent'
						defaultChecked
						/>
					<label htmlFor='taxTypePercent'>
						%
					</label>
					<input
						type='radio'
						value='flat'
						name='taxType'
						id='taxTypeFlat'
						/>
					<label htmlFor='taxTypeFlat'>
						$
					</label>
				</div>
				<div className='tax-field'>
					<label htmlFor='tax'>
						Tax
					</label>
					<div className='align-type'>
						<span>%</span>
						<input
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
						this.setSelection(0, 'tax')
					}}
					value='false'
					name='showTax'
					className='hide-tax'
				>
					x
				</button>
			</div>
			taxButton = null
		}

		let shipping = null
		let shippingButton = null

		if (!this.state.showShipping) {
			shippingButton = <div className='shipping-field'>
				<button
				className='show-shipping'
				onClick={this.handleChange}
				value='true'
				name='showShipping'
				>
					+ shipping
				</button>
			</div>
			shipping = null
		} else if (this.state.showShipping) {
			shipping = <div className='shipping-field'>
				<div>
					<label htmlFor='shipping'>
						Shipping
					</label>
					<input
						name='shipping'
						type='number'
						min='0'
						onChange={this.handleChange}
					/>
				</div>
				<button
					onClick={(e) => {
						this.handleChange(e)
						this.setSelection(0, 'shipping')
					}}
					className='hide-shipping'
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
			}}>
				<div className='wrapper'>
					<div className='invoice-header'>
						<div className='top'>
							<div className='column-left'>
								<h1>Invoice</h1>

									<label htmlFor='number' className='number-label'>
										<span>#</span>
										<input
										name='number'
										className='number'
										onChange={this.handleChange}
										value={this.state.number}
										/>
									</label>
								</div>

								{logo}

							</div>
							<div className='two-col'>
								<div className='head-col-left'>
									<label htmlFor='from'>
										From
									</label>
									<textarea
										name='from'
										onChange={this.handleChange}
									/>

									<label htmlFor='to'>
										Bill To
									</label>
									<textarea
										name='to'
										onChange={this.handleChange}
									/>
								</div>
								<div className='head-col-right'>
									<span className='date'>
										Date
									</span>
									<DatePicker
										selected={this.state.date}
										onChange={(date) => this.setSelection(date, 'date') }
										name='dueDate'
										showMonthDropdown
									 />

									<label htmlFor='paymentTerms'>
										Payment Terms
									</label>
									<input
										name='paymentTerms'
										onChange={this.handleChange}
									/>

									<span className='date'>
										Due Date
									</span>
									<DatePicker
										selected={this.state.dueDate}
										onChange={(date) => this.setSelection(date, 'dueDate') }
										name='dueDate'
										showMonthDropdown
									 />

									<span className='balance'>
									 	Balance Due: ${calcBalanceDue(total, this.state.amountPaid)}
									</span>
								</div>
							</div>
						</div>
						<div className='items-container'>
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
													quantity: parseFloat(item.quantity),
													rate: parseFloat(item.rate),
													amount: (item.rate * item.quantity)
												}

												if ((name === 'quantity' || name === 'rate') && value === '') {
													value = 0
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
								})}
							</ul>
							<button
								className='add-line-item'
								onClick={()=>{
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

						<div className='two-col invoice-footer'>
							<div className='invoice-bill'>
								<span>
									Subtotal: ${calcSubtotal(this.state.items)}
								</span>

								{discount}

								{tax}

								{shipping}

								<div className='buttons'>
									{discountButton}
									{taxButton}
									{shippingButton}
								</div>

								<div className='total-field'>
									<span>Total: ${total}</span>
								</div>

								<div className='amount-paid-field'>
									<div>
										<label htmlFor='amountPaid'>
											Amount Paid
										</label>
										<input
											name='amountPaid'
											type='number'
											min='0'
											onChange={this.handleChange}
										/>
									</div>
								</div>
							</div>
							<div className='notes-terms'>
								<label htmlFor='notes'>
									Notes
								</label>
								<textarea
									name='notes'
									onChange={this.handleChange}
								/>

								<label htmlFor='terms'>
									Terms
								</label>
								<textarea
									name='terms'
									onChange={this.handleChange}
								/>
							</div>
						</div>

				</div>
				<div className='footer'>
					<div className='footer-buttons'>
						<input type='submit' className='submit'/>
						<button
							onClick={()=>{
								console.log(this.state)
							}}>
							Log state
						</button>
					</div>
				</div>
			</form>


		)
	}

}
