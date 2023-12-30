const jwt = require("jsonwebtoken");
const { findDocument } = require("../helpers/MongoDbHelper");

// CHECK ROLES
const allowRoles = (...roles) => {
  // return a middleware
  return (request, response, next) => {
    // GET BEARER TOKEN FROM HEADER
    const bearerToken = request.get("Authorization").replace("Bearer ", "");

    // DECODE TOKEN
    const payload = jwt.decode(bearerToken, { json: true });

    // AFTER DECODE TOKEN: GET UID FROM PAYLOAD
    const _id = payload.id;

    // FING BY _id
    findDocument(_id, "employees")
      .then((user) => {
        if (user && user.roles) {
          let ok = false;
          user.roles.forEach((role) => {
            if (roles?.includes(role)) {
              ok = true;
              return;
            }
          });
          if (ok) {
            next();
          } else {
            response.status(403).json({ message: "Forbidden" }); // user is forbidden
          }
        } else {
          response.status(403).json({ message: "Forbidden" }); // user is forbidden
        }
      })
      .catch(() => {
        response.sendStatus(500);
      })
  };
};

module.exports = allowRoles;
