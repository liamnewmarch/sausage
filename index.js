export default Symbol('Static');

export function join(array, joiner = '') {
  array.toString = () => array.join(joiner);
  return array;
}

export function map(items, func) {
  return join(Object.entries(items).map(([key, value]) => {
    return func(value, key, items);
  }));
}
