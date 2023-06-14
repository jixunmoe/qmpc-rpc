import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';

export default [
  {
    input: './src/lib.ts',
    output: {
      file: 'dist/lib.cjs',
      format: 'cjs',
    },
    plugins: [nodeExternals(), nodeResolve(), typescript(), terser()],
  },
  {
    input: './src/lib.ts',
    output: [{ file: 'dist/lib.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];
