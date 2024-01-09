module.exports = function (api) {
    api.cache(true);

    return {
        presets: ['babel-preset-expo'],
        plugins: [
            'react-native-reanimated/plugin',
            require.resolve('expo-router/babel'),
            [
                'module-resolver',
                {
                    alias: {
                        '@src': './src'
                    },
                    extensions: ['.js', '.jsx', '.ts', '.tsx']
                }
            ]
        ]
    };
};
