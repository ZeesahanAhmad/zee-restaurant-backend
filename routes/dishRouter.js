const express=require('express');
const bodyParser=require('body-parser');
const dishRouter=express.Router();
dishRouter.use(bodyParser.json());
const Dishes=require('../models/dishes');


// routes for dishes
dishRouter.route('/')
.get((req, res,next)=>{
    Dishes.find({})
    .then(dishes=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dishes);

    }, err=>next(err))
    .catch(err=>next(err));

})
.post((req, res, next)=>{
   Dishes.create(req.body)
   .then(dish=>{
       console.log('dish created successfully: '+dish);
       res.statusCode=200;
        
       res.json(dish);

   },err=> next(err))
   .catch(err=>next(err));
})
.put((req, res,next)=>{
    res.statusCode=403;
    res.end('put operation not supported on /dishes');
})
.delete((req, res, next)=>{
    Dishes.deleteMany()
    .then(resp=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json')
        res.json(resp);

    }, err=>next(err))
    .catch(err=>next(err));
});

// routes for dish with id
dishRouter.route('/:dishId')
.get((req, res,next)=>{
   Dishes.findById(req.params.dishId)
   .then(dish=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json')
    res.json(dish);

   })
   .catch(err=>next(err));

})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end('post operation not supported on /dishes/'+req.params.dishId);
})
.put((req, res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId,{
        $set:req.body
    },{new:true})
    .then(dish=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json')
        res.json(dish);
    }, err=>next(err))
    .catch(err=>next(err));
})
.delete((req, res, next)=>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then(resp=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json')
        res.json(resp);
    }, err=>next(err))
    .catch(err=>next(err));
});

// routes for comments for perticular dish
dishRouter.route('/:dishId/comments')
.get((req, res,next)=>{
   Dishes.findById(req.params.dishId)
   .then(dish=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json')
    res.json(dish.comments);
    } ,err=>next(err))
   .catch(err=>next(err));

})
.post((req, res, next)=>{
   Dishes.findById(req.params.dishId)
   .then(dish=>{
       if(dish!=null){
        dish.comments.push(req.body);
        dish.save()
        .then(dish=>{
            res.statusCode=200;
            res.setHeader('Content-Type', 'application/json')
            res.json(dish); 
        })
        .catch(err=>next(err));
       }
       else{
         var err=new Error("Dish "+req.params.dishId+" not found");
         err.status=404;
         return(next(err));
       }
   })
   .catch(err=>next(err));
})
.put((req, res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'+ req.params.dishId + '/comments');
})
.delete((req, res, next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if(dish!=null){
            for(var i=(dish.comments.length-1); i>=0; i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then(dish=>{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json')
                res.json(dish);
            })
            .catch(err=>next(err));
        }
        else{
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
});

// routes for perticular comment of perticuler dish
dishRouter.route('/:dishId/comments/:commentId')
.get((req, res,next)=>{
   Dishes.findById(req.params.dishId)
   .then(dish=>{
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish.comments.id(req.params.commentId));
    }
    else if (dish == null) {
        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status = 404;
        return next(err);
    }
    else {
        err = new Error('Comment ' + req.params.commentId + ' not found');
        err.status = 404;
        return next(err);            
    }
    } ,err=>next(err))
   .catch(err=>next(err));

})
.post((req, res, next)=>{
   res.statusCode=403;
   res.json("post operation on dishes/"+req.params.dishId+"/comments"+req.params.commentId+" not supported");
})
.put((req, res,next)=>{
   Dishes.findById(req.params.dishId)
   .then(dish=>{
    if (dish != null && dish.comments.id(req.params.commentId) != null) {
        
        if(req.body.rating){
            dish.comments.id(req.params.commentId).rating=req.body.rating;
        }
        if(req.body.comment){
            dish.comments.id(req.params.commentId).comment=req.body.comment;
        }
        dish.save()
        .then(dish=>{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, err=>next(err))
        .catch(err=>next(err));
    }
    else if (dish == null) {
        err = new Error('Dish ' + req.params.dishId + ' not found');
        err.status = 404;
        return next(err);
    }
    else {
        err = new Error('Comment ' + req.params.commentId + ' not found');
        err.status = 404;
        return next(err);            
    }
   },err=>next(err))
   .catch(err=>next(err));
})
.delete((req, res, next)=>{
    Dishes.findById(req.params.dishId)
    .then(dish=>{
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            Dishes.findById(req.params.dishId)
            .then(dish=>{
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                .then(dish=>{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, err=>next(err))
                .catch(err=>next(err));
            })
            .catch(err=>next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, err=>next(err))
    .catch(err=>next(err));
});

module.exports=dishRouter;