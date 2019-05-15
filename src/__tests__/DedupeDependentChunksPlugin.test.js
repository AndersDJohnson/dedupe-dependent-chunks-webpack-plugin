const { normalizeOptions } = require("..");

describe("normalizeOptions", () => {
  it("works for objects", () => {
    expect(
      normalizeOptions({
        key: "value"
      })
    ).toEqual([[["key"], ["value"]]]);
  });

  it("works for multi-valued objects", () => {
    expect(
      normalizeOptions({
        key: ["value", "value2"]
      })
    ).toEqual([[["key"], ["value", "value2"]]]);
  });

  it("works for arrays", () => {
    expect(normalizeOptions([["key", "value"]])).toEqual([
      [["key"], ["value"]]
    ]);
  });

  it("works for multi-valued arrays", () => {
    expect(normalizeOptions([[["key", "key2"], ["value", "value2"]]])).toEqual([
      [["key", "key2"], ["value", "value2"]]
    ]);
  });
});
