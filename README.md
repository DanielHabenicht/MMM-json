# MMM-SolarKiwiGrid

A Solar Module for MagicMirror2 designed to integrate with an Enphase Solar System

Attribution of basic work goes to https://github.com/tkrywit/MMM-Solar.

## Sample

![alt text](https://github.com/tkrywit/MMM-Solar/blob/master/AppSample.PNG "Example")

## Dependencies

- A [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror) installation

## Installation

1. Clone repo into MagicMirror/modules directory
2. Create an entry in 'config/config.js' with your local url and any config options.

**Example:**

```
 {
    module: 'MMM-Solar',
	position: 'bottom_left',
	config: {
		url: "http://192.***.***.***/rest/kiwigrid/wizard/devices", // Your local solartwatt installation
	}
 },
```

**Note:** Only enter your API Key in the `config.js` file. Your API Key is yours alone, _do not_ post or use it elsewhere.
