module.exports = {
    SERVER: 'http://192.168.2.19:8080/rafflemania/',
    apiUrl: 'api/v1/',
    RESTURL: {
        registerClientId: 'add/clientId',
        authenticationUrl: 'oauth/token',
        loginUrl: 'login',
        deleteClientId: 'logout/web'
    },
    secrets: {
        raffelSecret: ':secret'
    }
};