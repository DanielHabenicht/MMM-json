# Development

## Testing

```
echo '{
   "test": {
     "id": 1,
     "title": "json-server",
     "author": "typicode",
     "test": ["test1", "test2"]
   }
 }
' > db.json
npm install -g json-server
json-server --watch db.json
```
