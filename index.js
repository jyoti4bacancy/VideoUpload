const express =require('express')
const fileUpload = require('express-fileupload')
const app=express()
const Port=3000
const path=require('path')
const AWS=require('aws-sdk')

app.use(fileUpload())

app.get('/',(req,res)=>{
    res.send('hello')
})

const s3=new AWS.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
})


app.post('/videoUpload',(req,res)=>{

    let fileName=req.files.video;
    const Storepath=path.join(__dirname, "Videos",fileName.name)
    console.log(Storepath);
    // console.log(fileName);
   
    if(!req.files){
        return   res.status(401).send('please upload your video!')
      }
   fileName.mv(Storepath, function(err){

   if(err){
       return res.status(500).send(err)
   }
   res.send('video uploaded successfully!')

})

})


app.post('/videoUploadAWS',async(req,res)=>{

    if(!req.files){
        return   res.status(401).send('please upload your video!')
      }
      let video=req.files.video;
      let filename=video.name.split('.')
    let filetype=filename[filename.length-1]

    let r = Math.random().toString(36).substring(7);

    const params={
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${r}.${filetype}`,
        Body: video.data
    }
    s3.upload(params,(error,data)=>{
        if(error){
            return res.status(500).send(error)
        }
        res.status(200).send(data)
    })

})

app.listen(Port,()=>{
    console.log('app listening on port',Port);
    })
