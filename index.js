import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import  connectToDb from './routes/mongoose-connection.js';
import userRouter from './routes/users.js';
import authRouter from './routes/app-users.js';


const app = express();

const PORT = process.env.PORT || 5000;

await connectToDb();

app.use(cors());

app.use(express.json());

app.get('/users/gender', (req, res) => {
  // Replace this with your logic to fetch and return gender data
  const genderData = {
    male: 50,
    female: 30,
    other: 10,
  };
  res.json(genderData);
});

{/**req middleware */}
const myLogger=((req, res, next)=>{
  console.log(new Date().toISOString(), `Calling ${req.url}, Method: ${req.method} `);
  next();
})
app.use(myLogger);


{/**Authentication middleware */}
const  authMiddleware =(req,res,next) =>{

  const authToken = req.headers['auth-token']
  console.log('Auth Token', authToken); 
  
  try{
    jwt.verify(authToken, process.env.JWT_SECRET);
    next();
  }catch(e){
    res.status(401).send({msg: 'Unauthorized'})
  }
}

{/**route of routers */}
app.use('/users',authMiddleware, userRouter);
app.use('/auth', authRouter);


app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});