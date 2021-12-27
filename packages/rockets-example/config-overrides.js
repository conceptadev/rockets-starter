const {
  override,
  addPostcssPlugins,
  addWebpackModuleRule,
  addWebpackResolve,
} = require('customize-cra');

module.exports = override(
  addPostcssPlugins([require('tailwindcss'), require('autoprefixer')]),
  addWebpackModuleRule({
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            noEmit: false,
          },
          allowTsInNodeModules: true,
        },
      },
    ],
  }),
  addWebpackResolve({
    extensions: ['.tsx', '.ts', '.js'],
  }),
);

// module.exports = {
//     webpack: function(config, env) {
//         // ...add your webpack config
//         const newConfig = {
//             ...config,
//             module: {
//                 ...config.module,
//                 rules: [
//                     ...config.module.rules,
//                     {
//                         test: /\.tsx?$/,
//                         use:[
//                             {
//                                 loader: 'ts-loader',
//                                 options: {
//                                     compilerOptions: {
//                                         noEmit: false,
//                                     },
//                                     allowTsInNodeModules: true
//                                 },
//                             }
//                         ],
//                     },
//                 ],
//             },
//             resolve: {
//                 ...config.resolve,
//                 extensions: [...config.resolve.extensions, '.tsx', '.ts', '.js'],
//             },
//         }
//         return newConfig;
//       },
// }
