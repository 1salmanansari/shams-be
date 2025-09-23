module.exports = {
    apps: [{
        name: 'shams-api',
        script: 'dist/index.js',
        instances: 1,
        env: {
            NODE_ENV: 'production',
            PORT: 4000
        }
    }]
}