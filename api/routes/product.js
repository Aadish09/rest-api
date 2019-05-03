const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require("mongoose");
router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id') ///fetches only these three fields 
    .exec()
    .then(docs=>{
        const response ={
            count : docs.length ,
            product :docs.map(doc=>{
                return{
                    name: doc.name,
                    price:doc.price,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url :'http://localhost:3000/products/'+ doc._id
                    }
                }
            })

            }
            res.status(200).json({response});
        })
        
        
    .catch(err=>{
        res.status(500).json({error:err});}
    )
    
});

router.post('/',(req,res,next) =>{
    
     const product = new Product({
         _id : new mongoose.Types.ObjectId(),
         name : req.body.name,
         price: req.body.price
     });
    product.save()
    .then(result => {console.log(result);
        res.status(201).json({
            message:"Created Product succesfully",
            product: {
                name: result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                    url:"http://localhost:3000/products/"+result._id
                }

            }
        });})
    .catch(err=>{console.log(err);
    res.status(500).json({error:err})}
    )
    
});

router.get("/:productId",(req,res,next)=>{
    const id= req.params.productId;
   Product.findById(id).exec()
   .then(doc=>{
        console.log(doc);
        if(doc){res.status(200).json({
            name:doc.name,
            price:doc.price,
            id:doc._id,
        });}
        else{res.status(404).json({message :'not found'})
        }
        })
   .catch(err=>{
       console.log(err);
       res.status(500).json({error:err});
    });
    
});

router.patch("/:productId",(req,res,next)=>{
    const id=req.params.productId;
    const updateOps ={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.updateOne({_id:id},{$set:updateOps}).exec()
    .then(result=>{
        res.status(200).json({
            message:'Product successfuly updated',
            request:{
                type:'GET',
                url:'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err=>{
        res.status(500).json({error:err});
    })
       
    
});

router.delete("/:productId",(req,res,next)=>{
    const id=req.params.productId;
  
    Product.remove({_id:id}).exec()
    .then(result=>{
        res.status(200).json({
            message:'Product successfuly deleted'
        })

    .catch(err => {
        res.status(500).json({error:err});
    })
})  
   
});
module.exports = router;