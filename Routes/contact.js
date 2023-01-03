const router = require("express").Router()
const { json } = require("body-parser");
const bodyParser = require("body-parser");
const contactsModel=require("../Models/contacts");
router.use(bodyParser.json());
const { validateToken } = require("../Middleware/auth");

//posting 

router.post('/api/v1/contacts',validateToken,async(req,res)=>{
    try{
        const arr = req.body;
        console.log("hitting-post");
        console.log(req.user)

         for(let i=0; i<arr.length; i++){
            
            await contactsModel.create({
                name:arr[i].name,
                designation: arr[i].designation,
                company:arr[i].company,
                industry: arr[i].industry,
                email: arr[i].email,
                phoneNumber:arr[i].phoneNumber,
                country:arr[i].country,
                userId:req.user
            });
         }

    res.status(200).json({
        status:"success",
        user:arr
    })
    }
    catch(e){
        res.json({
            err:e.message
        })
        
    }
});

router.get("/api/v1/contacts",validateToken,async(req,res)=>{
    try{
        
        const users = await contactsModel.find({userId:req.user});
        console.log("1",users);
        res.status(200).json({
            status:"success",
            users
        })
        // if(users.length){
        //     res.status(200).json({
        //         status:"success",
        //         users
        //     })
        // }
        // else{
        //     res.status(404).json({
        //         status:"failed"
        //     })
        // }
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});

router.get("/api/v1/contacts/:email",validateToken,async(req,res)=>{
    try{

        const user = await contactsModel.findOne({email:req.params.email});
        if(user.email){
            res.status(200).json({
                status:"success",
                user
            })
        }
        else{
            res.status(404).json({
                status:"failed",
                message:"user does not exists"
            })
        }
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})




//delete contacts

router.delete("/api/v1/contacts/:id",validateToken,async(req,res)=>{
    console.log(req.params.id)
    try{

        const finddelete=await contactsModel.find({_id:req.params.id})

        const datadelete=await contactsModel.deleteOne({_id:req.params.id})
        
        res.json({
            status:"deleted",
            finddelete
        })
        console.log(datadelete);
    }

    
    catch(e){
         res.json({
            status:"failed",
            message:e.message
        })
        
    }
})

module.exports = router;