const { intersection } = require("lodash");

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

const handleSets = (sets, chunks) =>
  sets.forEach(set => {
    let [parents, children] = set;

    const parentChunks = chunks.filter(chunk => parents.includes(chunk.name));

    const parentChunksModules = parentChunks.map(parentChunk =>
      getModuleResources(parentChunk)
    );

    const commonParentsModuleResources = intersection(...parentChunksModules);

    const childChunks = chunks.filter(chunk => children.includes(chunk.name));

    childChunks.forEach(childChunk => {
      const childModules = getModules(childChunk);

      childModules.forEach(childModule => {
        if (commonParentsModuleResources.includes(childModule.resource)) {
          childChunk.removeModule(childModule);
        }
      });
    });
  });

class DedupeDependentChunksPlugin {
  constructor(options) {
    options = normalizeOptions(options);

    // TODO: validate

    this.sets = options;
  }
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(name, compilation => {
      compilation.hooks.optimizeChunks.tap(name, chunks => {
        handleSets(this.sets, chunks);
      });
    });
  }
}

DedupeDependentChunksPlugin._normalizeOptions = normalizeOptions;
DedupeDependentChunksPlugin._handleSets = handleSets;

module.exports = DedupeDependentChunksPlugin;
