const AuthController = require('../controllers/auth-controller');
exports.routesConfig = function (app) {

    app.post('/login', AuthController.authenticate);
    app.get('/users', [
        AuthController.validateJwt,
        AuthController.getAllUsers
    ]);

    app.post('/users', [
        AuthController.validateJwt,
        AuthController.saveUser
    ]);

    app.put('/users', [
        AuthController.validateJwt,
        AuthController.updateUser]);

    app.delete('/users', [
        AuthController.validateJwt,
        AuthController.deleteUser]);

    app.get('/roles', [
        AuthController.validateJwt,
        AuthController.getRoles]);
};