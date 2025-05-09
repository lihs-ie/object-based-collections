const rotateLeft32 = (value: number, bits: number): number => {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0;
};

const readUint32LittleEndian = (
  byteArray: Uint8Array,
  offset: number,
): number => {
  return (
    (byteArray[offset] |
      (byteArray[offset + 1] << 8) |
      (byteArray[offset + 2] << 16) |
      (byteArray[offset + 3] << 24)) >>>
    0
  );
};

export const xxHash32 = (input: string, seed = 0): number => {
  const PRIME_32_1 = 0x9e3779b1 >>> 0;
  const PRIME_32_2 = 0x85ebca77 >>> 0;
  const PRIME_32_3 = 0xc2b2ae3d >>> 0;
  const PRIME_32_4 = 0x27d4eb2f >>> 0;
  const PRIME_32_5 = 0x165667b1 >>> 0;

  const inputByteArray: Uint8Array = new TextEncoder().encode(input);
  const inputLength: number = inputByteArray.length;

  let hash32: number;
  let currentPosition = 0;

  if (inputLength >= 16) {
    let value1: number = (seed + PRIME_32_1 + PRIME_32_2) >>> 0;
    let value2: number = (seed + PRIME_32_2) >>> 0;
    let value3: number = (seed + 0) >>> 0;
    let value4: number = (seed - PRIME_32_1) >>> 0;

    const processLimit: number = inputLength - 16;

    while (currentPosition <= processLimit) {
      value1 = rotateLeft32(
        value1 +
          readUint32LittleEndian(inputByteArray, currentPosition) * PRIME_32_2,
        13,
      );
      value1 = (value1 * PRIME_32_1) >>> 0;
      currentPosition += 4;

      value2 = rotateLeft32(
        value2 +
          readUint32LittleEndian(inputByteArray, currentPosition) * PRIME_32_2,
        13,
      );
      value2 = (value2 * PRIME_32_1) >>> 0;
      currentPosition += 4;

      value3 = rotateLeft32(
        value3 +
          readUint32LittleEndian(inputByteArray, currentPosition) * PRIME_32_2,
        13,
      );
      value3 = (value3 * PRIME_32_1) >>> 0;
      currentPosition += 4;

      value4 = rotateLeft32(
        value4 +
          readUint32LittleEndian(inputByteArray, currentPosition) * PRIME_32_2,
        13,
      );
      value4 = (value4 * PRIME_32_1) >>> 0;
      currentPosition += 4;
    }

    hash32 =
      rotateLeft32(value1, 1) +
      rotateLeft32(value2, 7) +
      rotateLeft32(value3, 12) +
      rotateLeft32(value4, 18);
  } else {
    hash32 = (seed + PRIME_32_5) >>> 0;
  }

  hash32 = (hash32 + inputLength) >>> 0;

  while (currentPosition + 4 <= inputLength) {
    hash32 =
      (hash32 +
        readUint32LittleEndian(inputByteArray, currentPosition) *
          PRIME_32_3) >>>
      0;
    hash32 = (rotateLeft32(hash32, 17) * PRIME_32_4) >>> 0;
    currentPosition += 4;
  }

  while (currentPosition < inputLength) {
    hash32 = (hash32 + inputByteArray[currentPosition] * PRIME_32_5) >>> 0;
    hash32 = (rotateLeft32(hash32, 11) * PRIME_32_1) >>> 0;
    currentPosition++;
  }

  hash32 ^= hash32 >>> 15;
  hash32 = (hash32 * PRIME_32_2) >>> 0;
  hash32 ^= hash32 >>> 13;
  hash32 = (hash32 * PRIME_32_3) >>> 0;
  hash32 ^= hash32 >>> 16;

  return hash32 >>> 0;
};

const avalanche32 = (hash: number): number => {
  hash ^= hash >>> 16;

  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;

  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;

  return hash >>> 0;
};

export interface Hasher {
  hash: <T>(value: T) => number;
}

type Algorithm = (value: unknown) => number;

export const Hasher = (
  algorithm: Algorithm = (value) => {
    const hash = xxHash32(String(value));

    return avalanche32(hash);
  },
): Hasher => ({
  hash: <T>(value: T): number => {
    if (typeof value === 'string') {
      return algorithm(value);
    }

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'boolean') {
      return value ? 1 : 0;
    }

    if (value === null || value === undefined) {
      return 0;
    }

    if (
      typeof value === 'function' ||
      typeof value === 'bigint' ||
      typeof value === 'symbol'
    ) {
      return algorithm(value.toString());
    }

    if (Array.isArray(value)) {
      const hashes = value.map((item) => Hasher().hash(item));

      return algorithm(hashes.join(','));
    }

    const name = value.constructor.name;
    const properties = Object.entries(value);

    return algorithm(
      name +
        properties.map(([key, val]) => algorithm(`${key}:${val}`)).join(''),
    );
  },
});
