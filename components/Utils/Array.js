const splitByCondition = (arr, func) => {
  const result = [[]];
  for(let i = 0; i < arr.length; i++) {
    if (func(arr[i])) {
      result.push([arr[i]]);
      if (arr[i + 1]) result.push([]);
      continue;
    }
    result[result.length - 1].push(arr[i]);
  }
  return result;
}

export default {
  splitByCondition,
}