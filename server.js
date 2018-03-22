// let http = require("http");
let request = require('request');
let express = require('express');
let app = express();
let ejs = require('ejs');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true ,limit:'50mb'}));

let config = require('./config.json');

app.get("/",function(req,res){
    res.render('home');
    return;
})

app.post("/postMessage",function(req,res){
    return postMessage(req, res);
})

app.post("/chatUpdate",function(req,res){
    return chatUpdate(req, res);
})

app.post("/chatDelete",function(req,res){
    return chatDelete(req, res);
})


function postMessage(req, res){

    let username= encodeURIComponent(req.body.botName);
    let channel= encodeURIComponent('#' + req.body.channel);
    let text= encodeURIComponent(req.body.text);
    let token= req.body.token;
    token = !!config.token[token] ? config.token[token] : token;
    let option = {
        url: 'https://slack.com/api/chat.postMessage?token=' + token + '&channel=' + channel + '&username=' + username + '&text=' + text,
        method: 'GET',
        json: true,
    }
    request(option, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
        
        return res.send({result:body});
    });
}

function chatUpdate(req, res){

    let channel= encodeURIComponent(req.body.channel);
    let text= encodeURIComponent(req.body.text);
    let ts= encodeURIComponent(req.body.ts);
    let token= req.body.token;
    token = !!config.token[token] ? config.token[token] : token;

    let option = {
        url: 'https://slack.com/api/chat.update?token=' + token + '&channel=' + channel + '&ts=' + ts + '&text=' + text,
        method: 'POST',
    }
    request(option, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
        
        return res.send({result:JSON.parse(body)});
    });
}   

function chatDelete(req, res){
    let channel= encodeURIComponent(req.body.channel);
    let ts= encodeURIComponent(req.body.ts);
    let token= req.body.token;
    token = !!config.token[token] ? config.token[token] : token;
    
    let option = {
        url: 'https://slack.com/api/chat.delete?token=' + token + '&channel=' + channel + '&ts=' + ts ,
        method: 'POST',
    }
    request(option, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
        
        return res.send({result:body});
    });
}

app.listen(3000);