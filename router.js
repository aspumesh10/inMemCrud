const controller = require("./controllers/userManagement");

function router(app) {
    app.get("/users/:id", controller.getUser);
    app.get("/users/", controller.getAllUser);
    app.post("/users", controller.addUser);
    app.put("/users/:id", controller.updateUser);
    app.delete("/users/:id", controller.deleteUser);
}

module.exports = router;