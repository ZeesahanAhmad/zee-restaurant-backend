const express=require('express');
const bodyParser=require('body-parser');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res,next)=>{
    res.end('here is the details of all the promotions!');

})
.post((req, res, next)=>{
    res.end('adding all the details of promotions: '+req.body.name+' and'+req.body.description);
})
.put((req, res,next)=>{
    res.statusCode=403;
    res.end('put operation not supported on /promotions');
})
.delete((req, res, next)=>{
    res.end('deleting all promotions...');
});

promoRouter.route('/:promoId')
.all((req, res, next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res,next)=>{
    res.end('here is the details of promoId: '+req.params.promoId);

})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end('post operation not supported on /promotions/'+req.params.promoId);
})
.put((req, res,next)=>{
    res.end('updating dish with promoId: '+req.params.promoId);
})
.delete((req, res, next)=>{
    res.end('deleting promoId='+req.params.promoId+"...");
});

module.exports=promoRouter;