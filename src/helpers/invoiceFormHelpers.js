export const calcSubtotal = (items) => {
	return items.reduce((total,item) => {
		return total + (item.rate * item.quantity)
	}, 0)
}

export const calcPercent = (percentAmount, subTotal) => {
	return (percentAmount / 100) * subTotal
}

export const calcRate = (type, amount, subTotal) => {
	if (type === 'percent') {
		return calcPercent(amount, subTotal)
	} else if (type === 'flat') {
		return amount
	} else {
		throw new Error('Unrecognized Type')
	}
}

export const calcTotal = (subTotal, tax, discount, shipping) => {
	return (parseFloat((subTotal  - discount) + tax + shipping).toFixed(2))
}

export const calcBalanceDue = (total, amountPaid) => {
	return (total - amountPaid).toFixed(2)
}
