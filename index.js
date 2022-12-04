const express =require("express");
const body_parser=require("body-parser");
const axios=require("axios");
const app=express().use(body_parser.json());
require('dotenv').config()
const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;
//check again
function sendMsgRequest(config)
{console.log(JSON.parse(config.data).text.body);
  axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              });
}
 


app.listen(process.env.PORT,()=>{
    console.log("Hey I am webhook _I am listening rightnow");
});
// app.listen(8000,()=>{
//   console.log("Hey I am webhook _I am listening rightnow");
// });

app.get("/webhook",(req,res)=>{
    let mode=req.query["hub.mode"];
    let challenge=req.query["hub.challenge"];
    let token=req.query["hub.verify_token"]
  
  if(token && mode)
  {
      if(mode==="subscribe" &&token===mytoken)
      {
          res.status(200).send(challenge);

      }
      else
      {
        res.status(403);

      }
  }
})

var sessionSSS={};

 function sendMsg(msg)
{console.log(msg)
    fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))
}

function getAlphanumeric(info,data,config)
{console.log(info)
const url="https://dummyjson.com/users/search?q="+info.FirstName;
var finalMsg="";
axios(url)
.then(function(res) {
  var arr=res.data.users
  console.log(arr.length);
  if(arr.length!=0)
  
  { finalMsg= "YOUR ALPHANUMERIC CODE IS"+arr[0].bank.cardNumber;
  console.log(finalMsg)
        data=JSON.parse(data);
        data.text.body=finalMsg;
        data=JSON.stringify(data);
        config.data=data;
        sendMsgRequest(config);
  }
    else
    {
  finalMsg="Sorry No user is registered in our data base with your respective given details";
  console.log(finalMsg)
  data=JSON.parse(data);
  data.text.body=finalMsg;
  data=JSON.stringify(data);
  config.data=data;
  sendMsgRequest(config);
    }  
});
}

function logic(msg,num,time,data)
{var finalMsg="t";
var config = {
  method: 'post',
  url: 'https://graph.facebook.com/v15.0/104953432431603/messages',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'Bearer '+token
  },
  data : data
};
if(!sessionSSS.hasOwnProperty(num))
  {var val={FirstName:null,LastName:null,RegistrationNumber:null ,StartFlag:false,timeStamp:time};
      sessionSSS[num]=val;
      finalMsg="Hi User,I am a Dumb Bot .\n please follow the instructions given below.\n to generate your alphanumeric code \n we will gather your information in this flow\n Send a <Start> text Keyword in order to initiate the information gathering.\nYou will be direct to send message as answer to some of the prompts info. Like Please enter Your First name . Similiarly for lastname and Registration number   "
      data=JSON.parse(data);
      data.text.body=finalMsg;
      data=JSON.stringify(data);
      config.data=data;
      sendMsgRequest(config);
  }
  else
  {console.log(sessionSSS)
    if(parseInt(time)-parseInt(sessionSSS[num].timeStamp) >300)
    { var val1={FirstName:null,LastName:null,RegistrationNumber:null,StartFlag:false,timeStamp:time};
     sessionSSS.num=val1;
        finalMsg="It seams you were away for a bit longer time . For code generation try again .Please follow the instructions while providing information to bot .Send a start once you go through this set of instruction"
        console.log(finalMsg)
        data=JSON.parse(data);
        data.text.body=finalMsg;
        data=JSON.stringify(data);
        config.data=data;
        sendMsgRequest(config);
    }
    else
    {
        if(msg.toLowerCase()==="start")
        { sessionSSS[num].StartFlag=true;
            finalMsg="Please Enter Your First Name (Registered one)"
            console.log(finalMsg)
            data=JSON.parse(data);
            data.text.body=finalMsg;
            data=JSON.stringify(data);
            config.data=data;
            sendMsgRequest(config);
        }
        else if(msg.toLowerCase()==="abort" )
        {//var val2={FirstName:null,LastName:null,RegistrationNumber:null ,StartFlag:false,timeStamp:time};
//console.log(sessionSSS.num);
     sessionSSS[num].FirstName=null;
     sessionSSS[num].LastName=null;
     sessionSSS[num].RegistrationNumber=null;
     sessionSSS[num].StartFlag=false;
     sessionSSS[num].timeStamp=time;
     finalMsg="You had opted to abort operation .Please Follow the rules given below for re-entering your information. \n please follow the instructions given below.\n to generate your alphanumeric code \n we will gather your information in this flow\n Send a <Start> text Keyword in order to initiate the information gathering.\nYou will be direct to send message as answer to some of the prompts info. Like Please enter Your First name . Similiarly for lastname and Registration number   "
     console.log(finalMsg);
     data=JSON.parse(data);
     data.text.body=finalMsg;
     data=JSON.stringify(data);
     config.data=data;
     sendMsgRequest(config);
            
        }
        else if(msg.toLowerCase()==="ok" && sessionSSS[num].StartFlag)
        {
            finalMsg="AlphanumericKey";
            getAlphanumeric(sessionSSS[num],data,config);
            
        }
        else if(sessionSSS[num].FirstName==null && sessionSSS[num].StartFlag)
        {
            sessionSSS[num].FirstName=msg;
            finalMsg="Please Enter Your LastName";
            
            console.log(finalMsg)
            data=JSON.parse(data);
            data.text.body=finalMsg;
            data=JSON.stringify(data);
            config.data=data;
            sendMsgRequest(config);
        }
        else if(sessionSSS[num].LastName==null && sessionSSS[num].StartFlag)
        {
            sessionSSS[num].LastName=msg;
            finalMsg="Please Enter Your RegistrationNumber";
            console.log(finalMsg)
            data=JSON.parse(data);
            data.text.body=finalMsg;
            data=JSON.stringify(data);
            config.data=data;
            sendMsgRequest(config);
        }
        else if(sessionSSS[num].RegistrationNumber==null && sessionSSS[num].StartFlag )
        {
            sessionSSS[num].RegistrationNumber=msg;
              finalMsg="Verify your Info & send a Ok after that . If you want to re enter the info .Send a <ABORT> as normal msg.\n Your FirstName= "+sessionSSS[num].FirstName+" \n YOur LastName = "+sessionSSS[num].LastName+"\n YOUR registrationNumber = "+sessionSSS[num].RegistrationNumber;
            // finalMsg=sessionSSS[num].FirstName+sessionSSS[num].LastName+sessionSSS[num].RegistrationNumber;
            console.log(finalMsg)
            data=JSON.parse(data);
            data.text.body=finalMsg;
            data=JSON.stringify(data);
            config.data=data;
            sendMsgRequest(config);
        }
        else
        {
          finalMsg="Sorry We think you went away from conversational flow. You can try again to generate your code ";
          data=JSON.parse(data);
            data.text.body=finalMsg;
            data=JSON.stringify(data);
            config.data=data;
            sendMsgRequest(config);
          delete sessionSSS[num];
        }
    }
      
  }
  return ;
}   

app.post("/webhook",(req,res)=>{
    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2))
    console.log("inside post /webhook=>   .")
    if(body_param.object)
    { 
        if(body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.messages && body_param.entry[0].changes[0].value.messages[0])
        {
            let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from =body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body=body_param.entry[0].changes[0].value.messages[0].text.body;
            let timestamp=body_param.entry[0].changes[0].value.messages[0].timestamp;
           // console.log("nested if .....")
            console.log(phon_no_id);
            console.log(from);
            console.log(msg_body);
            console.log(timestamp);
            // axios({
            //     method: 'post',
            //     url: 'https://graph.facebook.com/v15.0/'+phon_no_id+"/messages?access_token"+token,
            //     data: {
            //       messaging_product:"whatsapp",
            //       to:from,
            //       text:{
            //           body: "Your_msg_is_appended_at_end"+msg_body
            //       }
            //     },
            //     headers:{
            //         "Content-Type":"application/json"
            //     }
            //   });

            var data = JSON.stringify({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": from,
                "type": "text",
                "text": {
                  "preview_url": false,
                  "body": "text-message-content-is-appended-here-"+msg_body
                }
              });
              
              // var config = {
              //   method: 'post',
              //   url: 'https://graph.facebook.com/v15.0/104953432431603/messages',
              //   headers: { 
              //     'Content-Type': 'application/json', 
              //     'Authorization': 'Bearer '+token
              //   },
              //   data : data
              // };
              logic(msg_body,from,timestamp,data);
             
              //sendMsgRequest(config);
              
              res.sendStatus(200);
        }
        else
        {
            res.sendStatus(404);
        }
    }
})

app.get("/",(req,res)=>{
    res.status(200).send("Hi from webhook setup get");
})