import convertAppResourceToKube from './convertAppResourceToKube';

test('Convert internal app resource to kubernetes resource', () => {
  expect(convertAppResourceToKube({})).toBeUndefined();
  expect(convertAppResourceToKube(null)).toBeUndefined();
  expect(convertAppResourceToKube({ limits: {} })).toBeUndefined();
  expect(convertAppResourceToKube({ requests: {} })).toBeUndefined();
  expect(convertAppResourceToKube({ limits: {}, requests: {} })).toBeUndefined();
  expect(convertAppResourceToKube({ limits: { cpu: 0, memory: 0 } })).toBeUndefined();

  expect(convertAppResourceToKube({ limits: { cpu: 1, memory: 0 } })).toStrictEqual({ limits: { cpu: '1' } });
  expect(convertAppResourceToKube({ limits: { cpu: 1, memory: 10 } })).toStrictEqual({
    limits: { cpu: '1', memory: '10Mi' },
  });

  expect(convertAppResourceToKube({ limits: { cpu: 2, memory: 20 }, requests: { cpu: 1, memory: 10 } })).toStrictEqual({
    limits: { cpu: '2', memory: '20Mi' },
    requests: { cpu: '1', memory: '10Mi' },
  });
});
