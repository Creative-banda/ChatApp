const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    minifierConfig: {
      keep_classnames: false,
      keep_fnames: false,
      mangle: true,
      reserved: []
    },
    babelTransformerPath: require.resolve('react-native-svg-transformer')
  };

  // Add this if you use SVG files
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg']
  };

  return config;
})();