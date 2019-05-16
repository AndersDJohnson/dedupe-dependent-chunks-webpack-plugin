const { _normalizeOptions, _handleSets } = require("..");

describe("normalizeOptions", () => {
  it("works for objects", () => {
    expect(
      _normalizeOptions({
        key: "value"
      })
    ).toEqual([[["key"], ["value"]]]);
  });

  it("works for multi-valued objects", () => {
    expect(
      _normalizeOptions({
        key: ["value", "value2"]
      })
    ).toEqual([[["key"], ["value", "value2"]]]);
  });

  it("works for arrays", () => {
    expect(_normalizeOptions([["key", "value"]])).toEqual([
      [["key"], ["value"]]
    ]);
  });

  it("works for multi-valued arrays", () => {
    expect(_normalizeOptions([[["key", "key2"], ["value", "value2"]]])).toEqual(
      [[["key", "key2"], ["value", "value2"]]]
    );
  });
});

describe("handleSets", () => {
  const oneChunk = {
    resource: "1"
  };
  const twoChunk = {
    resource: "2"
  };
  const threeChunk = {
    resource: "3"
  };

  const removeModule = jest.fn();

  it("removes modules common to all parents", () => {
    const sets = [[["parent-1", "parent-2"], ["child"]]];
    const chunks = [
      {
        name: "parent-1",
        _modules: [oneChunk, twoChunk]
      },

      {
        name: "parent-2",
        _modules: [oneChunk, threeChunk]
      },
      {
        name: "child",
        _modules: [oneChunk, twoChunk],
        removeModule
      }
    ];
    _handleSets(sets, chunks);

    expect(removeModule).toHaveBeenCalledWith(oneChunk);
    expect(removeModule).not.toHaveBeenCalledWith(twoChunk);
    expect(removeModule).not.toHaveBeenCalledWith(threeChunk);
  });
});
