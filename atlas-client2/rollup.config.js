import resolve from 'rollup-plugin-node-resolve';

const rollupConfig = {
  input: 'src/Index.bs.js',
  output: [
    { format: 'cjs', file: 'dist/atlas-client.cjs.js' },
    { format: 'umd', file: 'dist/atlas-client.umd.js', name: 'ATLAS_CLIENT' },
    { format: 'esm', file: 'dist/atlas-client.esm.js' },
  ],
  plugins: [resolve()],
};

export default rollupConfig;