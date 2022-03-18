# Welcome

This is a Module for [MagicMirror](https://github.com/MichMich/MagicMirror). 
It is designed to display parts or the whole JSON response from an api.

## Preview

![alt text](https://github.com/DanielHabenicht/MMM-json/raw/main/sample.png "Example")

![alt text](https://user-images.githubusercontent.com/13590797/148958016-69f48869-8bec-4d90-b221-10025de54503.png "Advanced Example")


## Guide

1. Install by cloning this repository into `MagicMirror/modules` directory and installing the dependencies.

  ```bash
  cd ./modules
  git clone https://github.com/DanielHabenicht/MMM-json.git
  npm install
  ```

2. Create an entry in `config/config.js` with your url and any config options.

   
  ``` javascript title="config/config.js"
  {
    module: 'MMM-json',
    position: 'bottom_left',
    config: { // (1)
      url: "https://jsonplaceholder.typicode.com/users/1", // Path to your json api
    }
  },
  ```

1.  Have a look at the [configuration section](./configuration.md) for more configuration options.



!!! quote "Attribution"

    Attribution of some basic work and inspiration goes to [qistoph](https://github.com/qistoph/mmm-json).

