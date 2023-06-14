import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals';

export default [
  {
    input: './src/qmpc-cli.ts',
    output: {
      file: 'dist/qmpc-cli.cjs',
      format: 'cjs',
    },
    plugins: [nodeExternals(), nodeResolve(), typescript()],
  },
];
