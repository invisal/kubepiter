// Follow this implementation
// https://github.com/kubernetes-client/python/blob/master/kubernetes/utils/quantity.py
export function parseQuantity(q: string | number) {
  if (typeof q === 'number') return q;

  const exponents = {
    n: -3,
    u: -2,
    m: -1,
    K: 1,
    k: 1,
    M: 2,
    G: 3,
    T: 4,
    P: 5,
    E: 6,
  };

  const quantity = q.toString();
  const number = quantity.replace(/\D/g, '');
  const suffix = quantity.substring(number.length);

  const numberVal = Number(number) || 0;

  if (!suffix) {
    return numberVal;
  }

  let base = 1;
  if (suffix.endsWith('i')) {
    base = 1024;
  } else if (suffix.length === 1) {
    base = 1000;
  } else {
    throw new Error(`${q} has unknown suffix`);
  }

  if (!exponents[suffix[0]]) {
    throw new Error(`${q} has unknown suffix`);
  }

  return numberVal * Math.pow(base, exponents[suffix[0]]);
}
