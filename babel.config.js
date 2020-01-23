module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo', 'module:react-native-dotenv'],
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
