# gamedig.cloudno.de

## Accepted request query fields
* **type**
* **host**
* port
* requestRules

## Success response
_Status 200 application/json_  
Object. Return value of [node-gamedig](https://github.com/a-sync/node-gamedig#return-value) query.

## Error response
_Status 404 application/json_  
Object. Has a single `error` field with string value.
