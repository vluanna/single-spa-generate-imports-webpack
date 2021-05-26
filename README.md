# single-spa-generate-imports-webpack
A webpack plugin which allow to generate importmap.json with output filename for single-spa application on compile.

## Installation

```
npm install --save-dev single-spa-generate-imports-webpack
```

## Usage

In config file:

``` javascript
const SingleSpaGenerateImports = require('single-spa-generate-imports-webpack');
// ...
  module: {
    plugins: [
      new SingleSpaGenerateImports({
        packageName: '@hulk/core', // required
        staticPath: 'http://some.url/point/to/your/import/path', // default from env process.env.STATIC_PATH
        filename: 'importmap.json'
      }),
    ]
  },
// ...
```

Generate file:

``` javascript
// dist/importmap.json
{
  imports: {
    "@hulk/core": "http://some.url/point/to/your/import/path/hulk-core.<hash>.js"
  }
}
```

Multi Entry points:

``` javascript
const SingleSpaGenerateImports = require('single-spa-generate-imports-webpack');
// ...
  module: {
    entry: {
      'hulk-styleguide': `./src/main.ts`,
      'styles': `./src/styles.ts`,
    }
    ...
    plugins: [
      new SingleSpaGenerateImports({
        packageName: {
          'hulk-styleguide': '@hulk/styleguide',
          'styles': '@hulk/styleguide/styles',
          ...
        }
        ...
      }),
    ]
  },
// ...
```
Generate file multi imports:

``` javascript
// dist/importmap.json
{
  imports: {
    "@hulk/styleguide": "http://some.url/point/to/your/import/path/hulk-styleguide.<hash>.js"
    "@hulk/styleguide/styles": "http://some.url/point/to/your/import/path/styles.<hash>.js"
    ...
  }
}
```
