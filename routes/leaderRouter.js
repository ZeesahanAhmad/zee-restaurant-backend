const express=require('express');
const bodyParser=require('body-parser');
const leaderRouter=express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res,next)=>{
    res.end('here is the details of all the leaders!');

})
.post((req, res, next)=>{
    res.end('adding all the details of leader: '+req.body.name+' and'+req.body.description);
})
.put((req, res,next)=>{
    res.statusCode=403;
    res.end('put operation not supported on /leaders');
})
.delete((req, res, next)=>{
    res.end('deleting all leaders...');
});

leaderRouter.route('/:leaderId')
.all((req, res, next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})
.get((req, res,next)=>{
    res.end('here is the details of leader id: '+req.params.leaderId);

})
.post((req, res, next)=>{
    res.statusCode=403;
    res.end('post operation not supported on /leaders/'+req.params.leaderId);
})
.put((req, res,next)=>{
    res.end('updating dish with leaderId: '+req.params.leaderId);
})
.delete((req, res, next)=>{
    res.end('deleting leadersId='+req.params.leaderId+"...");
});

module.exports=leaderRouter;