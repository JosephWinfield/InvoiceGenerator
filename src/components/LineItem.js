import React from 'react';

export default (props) => {
	let button = null

	if (props.length > 1) {
		button = <button className='delete-line-item' onClick={props.onRemove}> x </button>
	}
	return (
		<li>
			<div className='top-area'>
				<span>Amount: ${props.amount}</span>
				{button}
			</div>

			<div className='line-item-fields'>
				<div className='middle-area'>
					<div className='label'>
						<label htmlFor='quantity'>
							Quantity
						</label>
						<input className='quantity'
							value={props.quantity}
							type='number'
							min='0'
							onChange={(event) => {
								const newQuantity = event.target.value
								props.onChange('quantity', newQuantity)
							}
						}/>
					</div>
					<div className='label rate-label'>
						<label htmlFor='rate'>
							Rate
						</label>
						<input className='rate'
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

				<div className='bottom-area'>
					<div className='label'>
						<label htmlFor='description'>
							Description
						</label>
						<input className='description'
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
