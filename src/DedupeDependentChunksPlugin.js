const getModules = chunk => [...(chunk._modules ? chunk._modules : [])];

const getModuleResources = chunk => getModules(chunk).map(mod => mod.resource);

const name = "DedupeDependentChunksPlugin";

class DedupeDependentChunksPlugin {
  constructor(options) {
    if (!options) options = {};

    // TODO: validate

    this.options = options;

    this.tree = options;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(name, compilation => {
      compilation.hooks.optimizeChunks.tap(name, chunks => {
        Object.entries(this.tree).forEach(([key, value]) => {
          const parentChunk = chunks.find(chunk => chunk.name === key);

          const parentModuleResources = getModuleResources(parentChunk);

          const childChunks = chunks.filter(chunk =>
            value.includes(chunk.name)
          );

          childChunks.forEach(childChunk => {
            const childModules = getModules(childChunk);

            childModules.forEach(childModule => {
              if (parentModuleResources.includes(childModule.resource)) {
                childChunk.removeModule(childModule);
              }
            });
          });
        });
      });
    });
  }
}

module.exports = DedupeDependentChunksPlugin;
