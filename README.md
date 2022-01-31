# gamedig.cloudno.de
Web service that returns gamedig query results in JSON format

## Accepted request query fields
* **type**: gamedig game type
* **host**: domain or IP of server
* port
* requestRules

## Success response
_Status 200 application/json_  
Object. Return value of [node-gamedig](https://github.com/a-sync/node-gamedig#return-value) query.

## Error response
_Status 404 application/json_  
Object. Has a single `error` field with string value.

## Examples
```
https://gamedig.cloudno.de/?type=arma3&host=arma.coalitiongroup.net&port=2313
https://gamedig.cloudno.de/?type=arma3&host=eu.fridaynightfight.org&requestRules=1
```
