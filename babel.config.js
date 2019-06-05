module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        /*plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        'react-native-paper': '../src/index',
                        'react-native-paper/types': '../types',
                        'react-native-vector-icons': '@expo/vector-icons',
                    },
                },
            ],
        ],*/
    };
};
