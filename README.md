# MMM-json

A Module for [MagicMirror](https://github.com/MichMich/MagicMirror) designed to
display parts or the whole JSON response from an api.

## Sample

![alt text](https://github.com/DanielHabenicht/MMM-json/raw/main/sample.png "Example")

## Installation

```bash
#  Clone the repository into MagicMirror/modules directory and install the dependencies
cd ./modules
git clone https://github.com/DanielHabenicht/MMM-json.git
npm install
```

2. Create an entry in 'config/config.js' with your url and any config options.

**Basic Example:**

```jsonc
{
  module: 'MMM-json',
  position: 'bottom_left',
  config: {
    url: "https://jsonplaceholder.typicode.com/users", // Path to your json api
  }
},
```

**Advanced Example JSONPath:**

```jsonc
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

**Advanced Example jq:**

```jsonc
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

**Advanced Example POST:**

```jsonc
{
  module: "MMM-json",
  position: "bottom_left",
  header: "JSON example POST",
  config: {
    url: "https://jsonplaceholder.typicode.com/posts",
    request: {
      method: "POST",
      json: {
        "search": "something"
      }
    }
  }
},
```

## Configuration

<table width="100%">
  <thead>
    <tr>
      <th>Property</th>
      <th width="100%">Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td><code>url</code></td>
      <td>The url where to get the json response from.
        <br><b>Type:</b> <code>string</code>
        <br><b>Default:</b> <code>https://jsonplaceholder.typicode.com/users</code>
      </td>
    </tr>
    <tr>
      <td><code>refreshInterval</code></td>
      <td>The interval with which the url is queried and your values are updated.
        <br><b>Type:</b> <code>int</code> (seconds)
        <br><b>Default:</b> <code>300000</code> => 5 minutes
      </td>
    </tr>
    <tr>
      <td><del><code>header</code></del></td>
      <td>
      Deprecated, use the built in <code>header</code>
       in the config
      </td>
    </tr>
    <tr>
      <td><code>headerIcon</code></td>
      <td>The Icon for your Header
        <br><b>Type:</b> <code>string</code> <a href="https://fontawesome.com/icons?d=gallery">any FontAwesome Icon</a>
        <br><b>Default:</b> <code></code> (none)
      </td>
    </tr>
    <tr>
      <td><code>request</code></td>
      <td>Custom parameters for the <a href="https://www.npmjs.com/package/request">request</a> call. For example request method, request headers, request body.
        <br><b>Type:</b> <code>object</code>
        <br><b>Default:</b> <code>{}</code> No additional parameters.
      </td>
    </tr>
    <tr>
      <td><code>jq</code></td>
      <td>Custom <a href="https://www.npmjs.com/package/jq.node">jq.node command</a> to apply to the data. Used to convert JSON data.
        <br><b>Type:</b> <code>string</code>
        <br><b>Default:</b> <code>'.'</code> Use value as received.
      </td>
    </tr>
    <tr>
      <td><code>values</code></td>
      <td>Custom Configuration of the values you want to display (see below)
        <br><b>Type:</b> <code>array</code>
        <br><b>Default:</b> <code>[]</code> Which means it displays all first level attributes (or the first element of an array).
      </td>
    </tr>
  </tbody>
</table>

### Value Configuration

<table width="100%">
  <thead>
    <tr>
      <th>Value-Property</th>
      <th width="100%">Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td><code>title</code></td>
      <td>The Title of the Property displayed on the screen
        <br><b>Type:</b> <code>string</code>
        <br><b>Default:</b> The attribute name
      </td>
    </tr>
    <tr>
      <td><code>query</code></td>
      <td>The <a href="https://restfulapi.net/json-jsonpath/">jsonpath</a> to the value of your json response you want to display. <a href="https://jsonpath.com/">Here you can test your expression</a>
        <br><b>Type:</b> <code>string</code>
        <br><b>Example:</b> <code>$[?(@.name=='Ervin Howell')].address.geo.lat</code>
      </td>
    </tr>
    <tr>
      <td><code>suffix</code></td>
      <td>String that will be displayed behind your query value
        <br><b>Type:</b> <code>string</code>
        <br><b>Example:</b> <code>%</code>
      </td>
    </tr>
    <tr>
      <td><code>prefix</code></td>
      <td>String that will be displayed in front of your query value
        <br><b>Type:</b> <code>string</code>
        <br><b>Example:</b> <code>EUR</code>
      </td>
    </tr>
  </tbody>
</table>

# Attribution

Attribution of some basic work and inspiration goes to
https://github.com/tkrywit/MMM-Solar.
