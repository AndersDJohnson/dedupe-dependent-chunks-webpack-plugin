const getModules = chunk => [...(chunk._modules ? chunk._modules : [])];

const getModuleResources = chunk => getModules(chunk).map(mod => mod.resource);

const name = "DedupeDependentChunksPlugin";

const arrayify = thing => (Array.isArray(thing) ? thing : [thing]);

const normalizeOptions = options => {
  if (!options) options = [];

  if (!Array.isArray(options)) {
    options = Object.entries(options).map(([key, value]) => [key, value]);
  }

  options = options.map(([parents, children]) => [
    arrayify(parents),
    arrayify(children)
  ]);

  return options;
};

class DedupeDependentChunksPlugin {
  constructor(options) {
    options = normalizeOptions(options);

    // TODO: validate

    this.sets = options;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(name, compilation => {
      compilation.hooks.optimizeChunks.tap(name, chunks => {
        this.sets.forEach(set => {
          let [parents, children] = set;

          const parentChunks = chunks.filter(chunk =>
            parents.includes(chunk.name)
          );

          const parentsModuleResources = parentChunks.reduce(
            (acc, parentChunk) => [...acc, ...getModuleResources(parentChunk)],
            []
          );

          const childChunks = chunks.filter(chunk =>
            children.includes(chunk.name)
          );

          childChunks.forEach(childChunk => {
            const childModules = getModules(childChunk);

            childModules.forEach(childModule => {
              if (parentsModuleResources.includes(childModule.resource)) {
                childChunk.removeModule(childModule);
              }
            });
          });
        });
      });
    });
  }
}

DedupeDependentChunksPlugin.normalizeOptions = normalizeOptions;

module.exports = DedupeDependentChunksPlugin;
