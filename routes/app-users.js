import express from 'express';
import { AppUserModel } from '../routes/models.js';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';
import { mailOptions, transporter } from './mail.js';

const authRouter = express.Router();

// POST request to register a user
    authRouter.post('/register', async (req, res) => {
    try {
        const payload = req.body;
        const appUser = await AppUserModel.findOne(
            { 
                email: payload.email 
            }, 
            { 
                id: 1, 
                name: 1, 
                email: 1
            }
            );

        if (appUser) {
            res.status(409).send({msg:'User already Exists'})
            return;
        }
            bcrypt.hash(payload.password, 10, async function (err, hash) {
                if (err) {
                    res.status(500).send({ msg: 'Error in registering' });
                    return;
                }

                const authUser = new AppUserModel
                ({ 
                    ...payload, password: hash, id: v4(), 
                    role: 'admin', isVerified: false 
                });

                await authUser.save();

                const verifyToken = jwt.sign(
                    { 
                        email: payload.email 
                    }, 
                    process.env.JWT_SECRET, { expiresIn: '1d' });

                const link = `${process.env.FRONTEND_URL}/verify?token=${verifyToken}`

                await transporter.sendMail(
                    {
                        ...mailOptions, to: payload.email, 
                        text:`Hii Hello, please verify your email ${link}`
                    }, 
                    )
                });
            res.send({ msg: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: 'Error in creating' });
    }
    })


    // GET request to fetch a student by email
    authRouter.get('/:email', async (req, res) => {
        try {
            const email = req.params.email;
            const appUser = await AppUserModel.findOne(
                { email }, 
                { 
                    id: 1, 
                    name: 1, 
                    email: 1 
                });
                
            if (appUser) {
                res.send(appUser);
            } else {
                res.status(404).send({ msg: 'User not found' });
            }        res.send(appUser);
        } catch (err) {
            console.error(err);
            res.status(500).send({ msg: 'Error occurred while fetching user' });
        }
    });


    authRouter.post('/verify', async (req, res) => {
        try {
            const token = req.body.token;
            jwt.verify (token, process.env.JWT_SECRET, async (err, result)=>{
                await AppUserModel.updateOne(
                    {
                        email:result.email
                    },
                    {
                        '$set':{isVerified:true}
                    }
                )
            })
                res.send({msg: 'user verified'});
            
        } catch (err) {
            console.error(err);
            res.status(500).send({ msg: 'Error occurred while fetching user' });
        }
    });


    // POST request for login
    authRouter.post('/login', async (req, res) => {
    try {
        const payload = req.body;
        const appUser = await AppUserModel.findOne(
            { 
                email: payload.email 
            },
            {
                id:1, 
                name: 1, 
                email: 1, 
                role: 1, 
                password: 1, 
                _id: 0 
            });

        if (appUser) {
            // Compare the provided password with the hashed password in the database
        await bcrypt.compare(payload.password, appUser.password, (_err, result) => {
                if (!result) {
                    res.status(401).send({ msg: 'Invalid credentials' });

                } else{
                    const responseObj = appUser.toObject();
                    delete responseObj.password;
                    const accessToken= jwt.sign(
                        {
                            role: responseObj.role
                        }, 
                        process.env.JWT_SECRET, { expiresIn: '1d' });

                    delete responseObj.role;
                    res.send({...responseObj, accessToken});
                };
            });
        } else {
            res.status(404).send({ msg: 'User not found' });
        }
    } catch (err) { 
        console.error(err);
        res.status(500).send({ msg: 'Error occurred while logging in' });
    }
});
export default authRouter;