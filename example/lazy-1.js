import dep1 from "./dep-1";

import(/* webpackChunkName: "lazy-2-1" */ "./lazy-2-1").then(() => {
  console.log("lazy-1 loaded lazy-2-1");
});

console.log("lazy-1 got dep-1", dep1);
