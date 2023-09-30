import express from 'express';

import { v4 } from 'uuid'; 

import  {userModel}  from './models.js';

const userRouter = express.Router();

// GET request method
userRouter.get('/', async (req, res) => {
    try {
        const users = await userModel.find({}, {
            id: 1,
            name: 1,
            age: 1,
            gender: 1,
            _id: 0,
        });
        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: "Error occurred while fetching users" });
    }
});

// POST request method
userRouter.post('/', async (req, res) => {
    try {
        const user = new userModel({ ...req.body, id: v4() });
        await user.save();
        res.send({ msg: "User created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Error creating user' });
    }
});

// PUT request method
userRouter.put('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await userModel.updateOne({ id: userId }, { '$set': req.body });
        res.send({ msg: "User updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Error updating user' });
    }
});

// DELETE request method
userRouter.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await userModel.deleteOne({ id: userId });
        res.send({ msg: "User deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send({ msg: 'Error deleting user' });
    }
});

export default userRouter;
