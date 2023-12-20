const users = require("../components/users");
function validateUuid(id) {
    const regex = new RegExp('^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$', 'g');
    return regex.test(id);
}

async function addUser(req, res) {
    try {
        let { userName, age, hobbies} = req.body;
        if (!userName) {
            return res.status(400).json({ status : 400, message: "userName is mandatory",data : null});
        }

        if (!age) {
            return res.status(400).json({ status : 400, message: "age is mandatory",data : null});
        }

        if (isNaN(age)) {
            return res.status(400).json({ status : 400, message: "age should be a number",data : null});
        }

        if (!hobbies) {
            return res.status(400).json({ status : 400, message: "hobbies are mandatory",data : null});
        }
        let data = await users.addUser({age: age, userName: userName, hobbies: hobbies})
        let uuid = await users.addUser({ userName, age, hobbies});
        return res.status(201).json({ status : 200, message: "User added successfully", data : {id : uuid}});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status : 500, message: "Something Went Wrong"});
    }
}

async function getUser(req, res) {
    try {
        let id = req.params.id;
        if (!validateUuid(id)) {
            return res.status(400).json({ status : 400, message: "invalid uuid received", data : null});
        }

        let userDetails = await users.getSingleUser(id);
        if (userDetails) {
            return res.status(200).json({ status : 200, message: "", data : userDetails});
        } else {
            return res.status(404).json({ status : 404, message: "user not found", data : null});
        }
        
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status : 500, message: "Something Went Wrong"});
    }
}

async function updateUser(req, res) {
    try {
        let id = req.params.id;
        let { userName, age, hobbies} = req.body;

        if (!validateUuid(id)) {
            return res.status(400).json({ status : 400, message: "invalid uuid received",data : null});
        }

        let userDetails = await users.getSingleUser(id);
        if (!userDetails) {
            return res.status(404).json({ status : 404, message: "user not found", data : null});
        }

        if(userName) {
            userDetails.userName = userName;
        }

        if (age && isNaN(age)) {
            return res.status(400).json({ status : 400, message: "age should be a number",data : null});
        } 

        if (age) {
            userDetails.age = age;
        }

        if (hobbies) {
            userDetails.hobbies = hobbies;
        }

        await users.updateUser(id, userDetails);
        return res.status(200).json({ status : 200, message: "User details updated"});

    } catch(error) {
        console.log(error);
        return res.status(500).json({ status : 500, message: "Something Went Wrong"});
    }
}

async function deleteUser(req, res) {
    try {
        let id = req.params.id;
        if (!validateUuid(id)) {
            return res.status(400).json({ status : 400, message: "invalid uuid received", data : null});
        }

        let userDetails = await users.getSingleUser(id);
        if (!userDetails) {
            return res.status(404).json({ status : 404, message: "user not found", data : null});
        }

        let delResult = await users.deleteUser(id);
        return res.status(200).json({ status : 200, message: "", data : userDetails});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status : 500, message: "Something Went Wrong"});
    }
}

async function getAllUser(req, res) {
    try {
        console.log("all users")
       let allUsers = await users.getUserList();
       return res.status(200).json({ status : 200, message: "", data : allUsers});
    } catch(error) {
        console.log(error);
        return res.status(500).json({ status : 500, message: "Something Went Wrong"});
    }
}

module.exports = {
    addUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUser
}