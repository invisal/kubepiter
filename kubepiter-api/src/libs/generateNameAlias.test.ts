import generateNameAlias from './generateNameAlias';

describe('Generate App Alias', () => {
  it('Generate app alias from name', () => {
    expect(generateNameAlias('Hello World', 0)).toBe('hello-world');
    expect(generateNameAlias('Hello World', 1)).toBe('hello-world-2');
    expect(generateNameAlias('Hello World', 2)).toBe('hello-world-3');

    // Double space should also generate a single dash
    expect(generateNameAlias('Hello  World', 0)).toBe('hello-world');

    // Trimming the space
    expect(generateNameAlias(' Hello World ', 0)).toBe('hello-world');

    // Multiple space
    expect(generateNameAlias('Generate and resize image', 0)).toBe('generate-and-resize-image');

    // Remove special character
    expect(generateNameAlias('This is @ *character', 0)).toBe('this-is-character');

    // If there is dash, keep the dash
    expect(generateNameAlias('hello-world', 0)).toBe('hello-world');

    // Underscore will also turn to dash
    expect(generateNameAlias('hello__world', 0)).toBe('hello-world');

    // Number is allowed
    expect(generateNameAlias('Hello World 2', 0)).toBe('hello-world-2');
    expect(generateNameAlias('Hello World 2', 1)).toBe('hello-world-2-2');
  });
});
