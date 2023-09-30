import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    id: {
        type: 'string', 
        required: true
    },
    name: {
        type: 'string', 
        required: true
    },
    age: {
        type: 'number', 
        required: true
    },
    gender: {
        type: 'string', 
        required: true
    }
});

const userModel = mongoose.model('users', userSchema);

const appUserSchema = new mongoose.Schema({
    id: {
        type: 'string', 
        required: true
    },
    firstName: {
        type: 'string', 
        required: true
    },
    lastName: {
        type: 'string', 
        required: true
    },
    email: {
        type: 'string', 
        required: true
    },
    password: {
        type: 'string', 
        required: true
    },
    role: {
        type: 'string', 
        required: true
    },
    isVerified: {
        type: 'boolean', 
        required: true
    }

});

const AppUserModel = mongoose.model('app-users', appUserSchema);

export { userModel, AppUserModel };