
# Examples


## Basic:

```javascript
{
  module: 'MMM-json',
  position: 'bottom_left',
  config: {
    url: "https://jsonplaceholder.typicode.com/users/1", // Path to your json api
    styleRules: [ // Provide custom style rules for any value
      {
        match: (value) => value == 1,
        style: "color: red;",
        class: "large"
      }
    ]  
  }
},
```

## Fetch-Options

```javascript
{
  module: "MMM-json",
  position: "bottom_left",
  header: "JSON example POST",
  config: {
    url: "https://jsonplaceholder.typicode.com/posts",
    fetchOptions: {
      method: "POST",
      body: {
        "search": "something"
      }
    }
  }
},
```

## JQ

You can preprocess the json response with [jq-node](https://www.npmjs.com/package/jq.node):

```javascript
{
  module: "MMM-json",
  position: "bottom_left",
  header: "JSON example jq",
  config: {
    url: "https://jsonplaceholder.typicode.com/users",
    headerIcon: "fa-cube",
    jq: 'keyBy("name") | mapValues(a => [a.address.street,a.address.suite,a.address.city].join(", "))'
  }
},
```

## JSONPath

With [JSONPath](https://restfulapi.net/json-jsonpath/) you can select the values you want to display:

```javascript
{
  module: "MMM-json",
  position: "bottom_left",
  header: "JSON",
  config: {
    url: "https://jsonplaceholder.typicode.com/users",
    headerIcon: "fa-cube",
    values: [
      {
        title: "Name",
        query: "$[1].name"
      },
      {
        title: "Coordinate 1",
        query: "$[?(@.id==2)].address.geo.lat",
        prefix: "LAT",
        suffix: "°"
      },
      {
        title: "Coordinate 2",
        query: "$[?(@.name=='Ervin Howell')].address.geo.lat",
        prefix: "LON",
        suffix: "°"
      }
    ]
  }
},
```

### Multi Value Example

```javascript
{
  module: "MMM-json",
  position: "bottom_left",
  header: "JSON example POST",
  config: {
    url: "https://jsonplaceholder.typicode.com/users/1",
    values: [
      {
        title: "Address",
        query: ["$.address.zipcode", "$.address.city", "$.address.street"],
        suffix: ["", ","]
      },
      {
        title: "Geo",
        query: ["$.address.geo.lat", "$.address.geo.lng"],
        suffix: ["LAT", "LNG"]
      }
    ],
  }
},
```