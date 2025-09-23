module.exports = {
    apps: [{
        name: 'shams-api',
        script: 'dist/index.js',
        instances: 1,
        env: {
            NODE_ENV: 'production',
            MONGO_URI: "mongodb+srv://zenansari0:ansari911@shams.4xcqxxp.mongodb.net/shamsdb?retryWrites=true&w=majority&appName=shams",
            PORT: 4000
        }
    }]
}