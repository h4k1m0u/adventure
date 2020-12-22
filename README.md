# Usage
- Run development server: `npm run start`
- Deployment: `npm run build`
- After deployment, and to access the dist/index.html file, an http server is needed to serve sprite images from the hard-drive: `python3 -m http.server`


# Prerequisites
### Create a package.json
This file will list all the dependencies:

```bash
npm init -y
```

### Webpack
Webpack is module bundler for merging js/css files into one (optimal for browsers), and for automating the build process (like cmake). Webpack-cli is needed since webpack 4.

```bash
npm install --save-dev webpack webpack-cli
```

Webpack-dev-server works in-memory to refresh the browser automatically when files are modified:

```bash
npm install --save-dev webpack-dev-server
```

html-webpack-plugin is needed to generate automatically an index.html file:

```bash
npm install --save-dev html-webpack-plugin
```

file-loader is needed to copy images automatically on build:

```bash
npm install --save-dev file-loader
```

### Three.js and its performance monitor
```
npm install three stats.js --save
```

### ESLint
Run linter on javascript source file:

```bash
npm install eslint --save-dev
npx eslint --init
npx eslint src/app.js
```

### Documentation
Run jsdoc to generate documentation on javascript source file:

```bash
npm install --save-dev jsdoc
npx jsdoc src/app.js
```

### Vim
- As mentioned in [YouCompleteMe README][ycm], it needs to be installed using (node is required):

```bash
./install.py --ts-completer
```

If it was already installed, you need to force it to use TSServer instead of Tern by deleting the following folder:

```bash
third_party/ycmd/third_party/tern_runtime/node_modules
```

- Add a [jsconfig.json][jsconfig] file similar to the one in this project at the root of your folder.

- Finally, check that YouCompleteMe (YCM) is running correctly by looking at the logs whose paths are printed with:

```bash
:YcmDebugInfo
```

[ycm]: https://github.com/ycm-core/YouCompleteMe#javascript-and-typescript-semantic-completion
[jsconfig]: https://code.visualstudio.com/docs/languages/jsconfig


# Tutorials
- Short [tutorial][1] to get started with webpack.
- A more comprehensive [tutorial][2] about project structure with webpack.

[1]: https://medium.com/@yakubova92/intro-to-webpack-46e8862d6627
[2]: https://hackernoon.com/webpack-the-basics-2712a7ad640b


# Icons
Icons are available on [this website][4] on a permissive license.

[4]: https://iconify.design/icon-sets/


# 3D Model
- A 3D model of a duck downloaded from [khronos-repo] in glb format.
- glb is like gltf but everything including the texture is bundled inside the same file.
- Blender is also capable of exporting 3D models in the glb format.

[khronos-repo]: https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0/Duck/glTF-Binary


# Games with three.js
Check out [yuka] for game AI coupled with three.js

[yuka]: https://github.com/Mugen87/yuka
