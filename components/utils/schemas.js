/* eslint-disable prettier/prettier */
const ExpenseSchema = {
	name: 'Expense',
	properties: {
		name:  {type: 'string', default: null},
		currency: {type: 'string', default: '€'},
		value: {type: 'double', default: null},
		day: {type: 'int', default: 0},
		month: {type: 'int', default: 0},
		year: {type: 'int', default: 0},
		cDate: {type: 'date'},
	},
};


export {ExpenseSchema}