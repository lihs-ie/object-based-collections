import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.esm.json',
        declaration: false,
        exclude: ['**/*.test.ts', '**/*.spec.ts', 'src/tests/**/*'],
      }),
    ],
    external: [],
  },
  // CJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.cjs.json',
        declaration: false,
        exclude: ['**/*.test.ts', '**/*.spec.ts', 'src/tests/**/*'],
      }),
    ],
    external: [],
  },
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/esm/index.d.ts',
      format: 'es',
    },
    plugins: [
      nodeResolve(),
      dts({
        tsconfig: './tsconfig.esm.json',
      }),
    ],
    external: [],
  },
]);
