const express= require("express");
const zod= require("zod")
const router= express.Router();
const {User}= require("../db")
const JWT_SECRET= require("../config");
const jwt= require("jwtwebtoken")
const  { authMiddleware } = require("../middleware");
 
const signupSchema= zod.object({
    username:zod.string().email(),
    pasword:zod.string(),
    firstName: zod.string(),
    lastName: zod.string(),

})

router.post("/signup",async (req,res)=>{
    const body=req.body;
    const obj = signupSchema.safeParse(req.body);
    if(!obj.success){
        return res.status(411).json({
            message:"email allready taken/Incorrect inputs"
        })
    }

    const user=User.findOne({
        useranme:body.username
    })

    if(user._id) {
        return res.json({
            message:"email allready taken/Incorrect inputs"
        })
    }

    const dbUser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    //create account and add random balance
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })


    const token = jwt.sign({
        userId
    }, JWT_SECRET)


    res.json({
        message:"user created successfully",
        token:token,
    })


})

const signinSchema=zod.object({
    username:zod.string().email(),
    password:zod.string(),

})

router.post("/signin",async (req,res)=>{
    const body=req.body;
    const {success} = signinSchema.safeParse(body);
    if(!success)
    {
        res.status(411).json({
            message: "invalid input/email",

        })
    }

    const user= await User.findOne({
        username:req.body.username,
        password:req.body.password
    });

    if(user)
    {
    const token=jwt.sign({
        userId:user._id
    },JWT_SECRET)

    res.json({
        token:token
    })
    return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })



})



const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})


router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
                 
module.exports= router;