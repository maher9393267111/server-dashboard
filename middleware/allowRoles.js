const jwt = require('jsonwebtoken');
const { findDocument } = require('../helpers/MongoDbHelper');
const Employee = require('../models/employee');

// CHECK ROLES
const allowRoles = (...roles) => {
    // return a middleware
    return (request, response, next) => {
        // GET BEARER TOKEN FROM HEADER
        const bearerToken = request.get('Authorization').replace('Bearer ', '');

        //console.log(bearerToken ,"TOKEEEEEEEEEEEEN")

        // DECODE TOKEN
        const payload = jwt.decode(bearerToken, { json: true });

        // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
        const _id = payload.id;

        // console.log("_ID PAYLOAD" ,_id)

        // FING BY _id
        Employee.findById(_id)
            .then((user) => {
            //    console.log('user THE☀️☀️☀️☀️☀️☀️☀️NNNN', user);

                if (user && user.roles) {
                    console.log(user.roles, 'ROLEEEEEEEEEEEE');
                    let ok = false;
                    user.roles.forEach((role) => {
                        if (roles?.includes(role)) {
                            ok = true;
                            return;
                        }
                    });
                    if (ok) {
                        // return user
                        // req.user =user
                        next();
                    } else {
                        response.status(403).json({ message: 'Forbidden' }); // user is forbidden
                    }
                } else {
                    response.status(403).json({ message: 'Forbidden' }); // user is forbidden
                }
            })
            .catch(() => {
                response.sendStatus(500);
            });
    };
};

module.exports = allowRoles;
