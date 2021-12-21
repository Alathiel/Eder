const Realm = require('realm');
import {ExpenseSchema} from '../utils/schemas';

export function migration(){
    Realm.open({
        schema: [ExpenseSchema],
        schemaVersion: 1,
        migration: (oldRealm, newRealm) => {
        // only apply this change if upgrading to schemaVersion 1
            if (oldRealm.schemaVersion < 1) {
                const oldObjects = oldRealm.objects('Expense');
                const newObjects = newRealm.objects('Expense');
        
                // loop through all objects and set the name property in the new schema
                for (let i = 0; i < oldObjects.length; i++) {
                    newObjects[i].uuid = oldObjects[i].uuid;
                    newObjects[i].name = oldObjects[i].name;
                    newObjects[i].currency = oldObjects[i].currency;
                    newObjects[i].value = oldObjects[i].value;
                    newObjects[i].day = oldObjects[i].value;
                    newObjects[i].month = oldObjects[i].value;
                    newObjects[i].value = oldObjects[i].value;
                    newObjects[i].year = oldObjects[i].value;
                    newObjects[i].cDate = oldObjects[i].value;
                    newObjects[i].category = 'Other';
                }
            }
        }
    });
}