const { flattenDeep, intersection } = require("lodash");

const getModules = chunk => [...(chunk._modules ? chunk._modules : [])];

const getModuleResources = chunk => getModules(chunk).map(mod => mod.resource);

const name = "DedupeDependentChunksPlugin";

const arrayify = thing => (Array.isArray(thing) ? thing : [thing]);

const normalizeOptions = options => {
  if (!options) {
    options = [];
  }

  if (typeof options === "string") {
    options = [options];
  }

  if (!Array.isArray(options)) {
    options = Object.entries(options).map(([key, value]) => [key, value]);
  }

  options = options.map(v => {
    if (typeof v === "string") v = [v];
    const [parents, children] = v;
    return [arrayify(parents), children && arrayify(children)].filter(Boolean);
  });

  return options;
};

const handleSets = (sets, chunks) =>
  sets.forEach(set => {
    let [parents, children] = set;

    if (!children) {
      children = parents;
      parents = undefined;
    }

    const childChunks = chunks.filter(chunk => children.includes(chunk.name));

    if (!parents) {
      parents = flattenDeep(
        [...childChunks[0]._groups.values()].map(g =>
          g.origins.map(o => [...o.module._chunks].map(c => c.name))
        )
      );
    }

    const parentChunks = chunks.filter(chunk => parents.includes(chunk.name));

    const parentChunksModules = parentChunks.map(parentChunk =>
      getModuleResources(parentChunk)
    );

    const commonParentsModuleResources = intersection(...parentChunksModules);

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
