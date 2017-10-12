import React from 'react';

export default (props) => {
	let button = null

	if (props.length > 1) {
		button = <button className='colored-button' onClick={props.onRemove}> x </button>
	}
	return (
		<li>
			<div className='space-below flex-row flex-space-between'>
				<span>Amount: ${props.amount}</span>
				{button}
			</div>

			<div className='two-col-row'>
				<div className='flex-row flex-justify-start two-col-right desktop-flex-row'>
					<div className='flex-column'>
						<label
							htmlFor='quantity'
							className='form-field-label'
						>
							Quantity
						</label>
						<input className='form-field-input'
							value={props.quantity}
							type='number'
							min='0'
							onChange={(event) => {
								const newQuantity = event.target.value
								props.onChange('quantity', newQuantity)
							}
						}/>
					</div>
					<div className='space-left flex-column'>
						<label
							htmlFor='rate'
							className='form-field-label'
						>
							Rate
						</label>
						<input className='form-field-input'
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

				<div className='flex-place two-col-left'>
					<div className='flex-column'>
						<label
							htmlFor='description'
							className='form-field-label'
						>
							Description
						</label>
						<input className='form-field-input'
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
