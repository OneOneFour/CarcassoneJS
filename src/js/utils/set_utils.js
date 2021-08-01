function isSuperset(set, subset) {
  return [...subset].reduce((acc, cur) => set.has(cur) && acc,
    true);
}
function intersection(A, B) {
  const int = new Set();
  [...B].forEach((elem) => {
    if (A.has(elem)) {
      int.add(elem);
    }
  });

  return int;
}
function difference(A, B) {
  // Calculates difference between set A and B
  const diff = new Set(A);
  [...B].forEach((elem) => {
    if (A.has(elem)) {
      diff.delete(elem);
    }
  });
  return diff;
}
function union(A, B) {
  const uni = new Set(A);
  [...B].forEach((elem) => {
    uni.add(elem);
  });
  return uni;
}

const fullSet = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
function remainder(assigned) {
  return difference(fullSet, assigned);
}

function setsEqual(A, B) {
  return isSuperset(A, B) && isSuperset(B, A);
}

export {
  isSuperset, intersection, difference, union, remainder, setsEqual,
};
