var fs = require('fs');
var jwt = require('jsonwebtoken');

exports.authenticate = (req, res) => {
    let jsonData;
    fs.readFile('db.json', 'utf8', (err, data) => {
        jsonData = JSON.parse(data);
        let found = jsonData.users.find(u => u.username === req.body.username);
        if (found && found.password === req.body.password) {
            const payload = {
                username: found.username,
                role: found.role
            };
            let token = jwt.sign(payload, 'SUPER_SECRET');
            res.status(200).send({ accessToken: token });
        } else {
            res.status(401).send({message: 'Invalid credentials'});
        }
    });
}

exports.validateJwt = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();
            } else {
                req.jwt = jwt.verify(authorization[1], 'SUPER_SECRET');
                return next();
            }
        } catch (err) {
            return res.status(403).send();
        }
    } else {
        return res.status(401).send();
    }
}

exports.getAllUsers = (req, res) => {
    if (req.jwt) {
        fs.readFile('db.json', 'utf8', (err, data) => {
            jsonData = JSON.parse(data);
            res.status(200).send(jsonData.users);
        });
    }
}

exports.getRoles = (req, res) => {
    fs.readFile('db.json', 'utf-8', (err, data) => {
        jsonData = JSON.parse(data);
        res.status(200).send(jsonData.roles);
    });
}

exports.saveUser = (req, res) => {
    fs.readFile('db.json', 'utf-8', (err, data) => {
        jsonData = JSON.parse(data);
        jsonData.users.push(req.body);
        fs.writeFile('db.json', JSON.stringify(jsonData), () => {
            res.status(200).send(jsonData.users);
        });
    });
}

exports.updateUser = (req, res) => {
    fs.readFile('db.json', 'utf-8', (err, data) => {
        jsonData = JSON.parse(data);
        let userIndex = jsonData.users.findIndex(u => u.username === req.body.username);
        jsonData.users.splice(userIndex, 1);
        jsonData.users.push(req.body);
        fs.writeFile('db.json', JSON.stringify(jsonData), () => {
            res.status(200).send(jsonData.users);
        })
    });
}

exports.deleteUser = (req, res) => {
    fs.readFile('db.json', 'utf-8', (err, data) => {
        jsonData = JSON.parse(data);
        let userIndex = jsonData.users.findIndex(u => u.username === req.body.username);
        jsonData.users.splice(userIndex, 1);
        fs.writeFile('db.json', JSON.stringify(jsonData), () => {
            res.status(200).send(req.body);
        });
    });
}