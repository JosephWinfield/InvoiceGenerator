import React from 'react';

export default (props) => {
	let button = null

	if (props.length > 1) {
		button = <button className='delete-line-item colored-button' onClick={props.onRemove}> x </button>
	}
	return (
		<li>
			<div className='space-below flex-row flex-space-between'>
				<span>Amount: ${props.amount}</span>
				{button}
			</div>

			<div className='line-item-fields two-col-row'>
				<div className='middle-area flex-row flex-justify-start two-col-right desktop-flex-row'>
					<div className='flex-column'>
						<label
							htmlFor='quantity'
							className='form-field-label'
						>
							Quantity
						</label>
						<input className='quantity form-field-input'
							value={props.quantity}
							type='number'
							min='0'
							onChange={(event) => {
								const newQuantity = event.target.value
								props.onChange('quantity', newQuantity)
							}
						}/>
					</div>
					<div className='rate-label flex-column'>
						<label
							htmlFor='rate'
							className='form-field-label'
						>
							Rate
						</label>
						<input className='rate form-field-input'
							value={props.rate}
							type='number'
							min='0'
							onChange={(event) => {
								const newRate = event.target.value
								props.onChange('rate', newRate)
							}
						}/>
					</div>
				</div>

				<div className='bottom-area two-col-left'>
					<div className='flex-column'>
						<label
							htmlFor='description'
							className='form-field-label'
						>
							Description
						</label>
						<input className='description form-field-input'
							value={props.description}
							onChange={(event) => {
								const newDescription = event.target.value
								props.onChange('description', newDescription)
							}
						}/>
					</div>
				</div>
			</div>
		</li>
	)
}
