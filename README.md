# React-BIM

An IFC model viewer using static assets only, based on [React](https://github.com/facebook/create-react-app) and [Three](https://github.com/mrdoob/three.js/).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## Loading models (current implementation...)

  - Point the `GLBFile` attribute in `App.js` to the `.glb` file you want to load.
  - The viewer presumes `.glb` files are converted from `.ifc` with `IfcConverter`, using a command like: `./IfcConvert --use-element-guids --site-local-placement file.ifc file.glb`.
  - (Placement of model in viewer, and lightning are currently hard coded)

  https://github.com/mrdoob/three.js/