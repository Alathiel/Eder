/* eslint-disable prettier/prettier */
const CarSchema = {
	name: 'Car',
	properties: {
	  make:  {type: 'string', default: null},
	  model: {type: 'string', default: null},
	  miles: {type: 'int', default: 0},
	}
};


export {CarSchema}