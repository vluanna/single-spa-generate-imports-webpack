const path = require("path");
const fs = require("fs");

const pluginName = "SingleSpaGenerateImports";

const joinURL = (baseUrl = '', filename = '') => {
  const base = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
  const name = filename.startsWith('/') ? filename.substring(1, filename.length) : filename;
  return base + '/' + name;
}
const isDisabled = (compilerOptions) => {
  return compilerOptions.mode !== 'production'
}

module.exports = class SingleSpaGenerateImports {
  static defaultOptions = {
    packageName: null,
    staticPath: process.env.STATIC_PATH,
    filename: "importmap.json",
    isDisabled,
  };

  constructor(options = {}) {
    this.options = { ...SingleSpaGenerateImports.defaultOptions, ...options };
  }
  apply(compiler) {
    compiler.hooks.done.tap(pluginName, ({ compilation }) => {
      let isBypassed = false;
      if (typeof this.options.isDisabled === 'boolean') {
        isBypassed = this.options.isDisabled
      }
      if (typeof isDisabled === 'function') {
        isBypassed = this.options.isDisabled(compilation.compiler.options)
      }
      if (isBypassed) return

      const staticPath = this.options.staticPath || process.env.STATIC_PATH;
      const outputPath = compilation.outputOptions.path;
      if (!staticPath) {
        return console.warn('"staticPath" not found, ' + pluginName + ' plugin is disabled by default.')
      }
      if (!this.options.packageName) {
        throw new Error(
          pluginName + ': "packageName" options are required!'
        );
      }
      const importmap = {};
      const assets = Array.from(compilation.assetsInfo.keys());

      if (typeof this.options.packageName === "string") {
        const orgName = this.options.packageName.split('/')[0] && this.options.packageName.split('/')[0].replace('@', '')
        const filename = assets.find((item) => item.endsWith(".js") && item.startsWith(orgName));
        importmap.imports = {
          [this.options.packageName]: joinURL(staticPath, filename),
        };
      } else if (typeof this.options.packageName === "object") {
        importmap.imports = {};
        Object.keys(this.options.packageName).map((name) => {
          const filename = assets.find(
            (item) => item.startsWith(name) && item.endsWith(".js")
          );
          if (filename) {
            importmap.imports[this.options.packageName[name]] = joinURL(staticPath, filename);
          }
        });
      } else {
        throw new Error(
          pluginName + ': "packageName" must be a string or an object map!'
        );
      }

      if (importmap.imports && Object.keys(importmap.imports).length) {
        fs.writeFileSync(
          path.join(outputPath, this.options.filename),
          JSON.stringify(importmap)
        );
      }
    });
  }
};
