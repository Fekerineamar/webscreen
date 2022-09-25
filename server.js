const express=require("express"),uuid=require("uuid"),axios=require("axios"),multer=require("multer"),puppeteer=require("puppeteer"),zipper=require("zip-local"),fs=require("fs"),app=express(),port=process.env.PORT||3e3,terminal=require("./route/app.js");readline=require("readline").createInterface({input:process.stdin,output:process.stdout,terminal:!1});let files,file,pathd,urlpath,log,binary=!1,json=!1,filesize=!1,urls="urls",result="result",errors="errors",regex=/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,maxSize=1048576,r=()=>readline.question("\n=> Terminal(1)\n=> GUI(2)\n\n Choose what You Like To use: ",(e=>{1==e?terminal():2==e?gui():r()}));r();const gui=()=>{app.use("/static",express.static("logo")),app.use("/data",express.static("data")),app.use("/errors",express.static("errors")),app.use(express.json()),app.use(((e,s,r)=>{e.id=uuid.v4(),log=uuid.v1().slice(0,9),r()}));const e=multer.diskStorage({destination(e,s,r){r(null,urls)},filename(e,s,r){r(null,"urls_"+e.id+".txt"),files=s}}),s=multer({storage:e});fs.existsSync(urls)||fs.mkdirSync(urls),fs.existsSync(result)||fs.mkdirSync(result),app.get("/",((e,s)=>{s.sendFile(__dirname+"/index.html")})),app.post("/",s.single("myFile"),(async(e,s)=>{let r=log+e.id,t=0,i=[],l=[],u=[];if(fs.mkdirSync(`${result}/result_${e.id}`),fs.mkdirSync(`${result}/result_${e.id}/${errors}`),fs.mkdirSync(`${result}/result_${e.id}/data`),!files||"text/plain"!=files.mimetype)return s.send({error:"Please upload a txt file"}),s.end(),fs.rmSync(`${result}/result_${e.id}`,{recursive:!0,force:!0}),void fs.rmSync(`${urls}/urls_${e.id}.txt`,{recursive:!0,force:!0});let a=fs.readFileSync(__dirname+`/${urls}/urls_${e.id}.txt`,"utf8");!0===/\ufffd/.test(a)&&(binary=!binary);try{return JSON.parse(a),void(json=!json)}catch(e){}files.size>maxSize&&(filesize=!filesize),filesize?(s.send({error:"file Too Large"}),s.end(),fs.rmSync(`${result}/result_${e.id}`,{recursive:!0,force:!0}),fs.rmSync(`${urls}/urls_${e.id}.txt`,{recursive:!0,force:!0})):binary||json?(s.send({error:"Please upload a txt file!"}),s.end(),fs.rmSync(`${result}/result_${e.id}`,{recursive:!0,force:!0}),fs.rmSync(`${urls}/urls_${e.id}.txt`,{recursive:!0,force:!0})):(()=>{try{(data=a.split("\n").filter((e=>""!=e))).forEach(((e,s)=>{regex.test(e)||(e="https://"+e),regex.test(e)&&i.push(e)})),i.length?(()=>{i=[...new Set(i)];let a=()=>{t!=i.length?(async()=>{await axios({url:i[t],timeout:2e4}).then((s=>{let r=JSON.stringify(s.headers),n=s.request.host;fs.appendFileSync(`${result}/result_${e.id}/data/data.txt`,n+"\n"),l.push(i[t]),u.push(n),fs.writeFileSync(`${result}/result_${e.id}/data/${n}.json`,r),t++,a()})).catch((s=>{let r;r=s.response?s.response.status+" "+s.response.statusText:`${s.code} Hostname`,fs.appendFileSync(`${result}/result_${e.id}/${errors}/errors.txt`,`GET: ${i[t]} => ${r}\n`),t++,a()}))})(i[t]):l.length?(s.send({success:r,l:l,hosts:u}),s.end()):(s.send({error:"Please upload a valid URL's"}),s.end(),fs.rmSync(`${result}/result_${e.id}`,{recursive:!0,force:!0}),fs.rmSync(`${urls}/urls_${e.id}.txt`,{recursive:!0,force:!0}))};a()})():(s.send({error:"Please upload a valid URL's"}),fs.rmSync(`${result}/result_${e.id}`,{recursive:!0,force:!0}),fs.rmSync(`${urls}/urls_${e.id}.txt`,{recursive:!0,force:!0}),s.end())}catch(e){}})()}));class r{constructor(e,s){this.req=e,this.res=s,this.I=0,this.url=this.req.l,this.host=this.req.hosts,this.id=this.req.success.slice(9)}screen=async()=>{try{let e=await puppeteer.launch({args:["--no-sandbox","--disabled-setupid-sandbox"]}),s=await e.newPage();await s.goto(this.url[this.I],{timeout:2e4}),await s.screenshot({path:`${result}/result_${this.id}/data/${this.host[this.I]}.png`}),await e.close(),this.I++,this.callme()}catch(e){"TimeoutError: Navigation timeout of 20000 ms exceeded"==e&&(fs.appendFileSync(`${result}/result_${this.id}/${errors}/errors.txt`,`GET: ${this.url[this.I]} => Navigation timeout\n`),fs.copyFileSync("logo/default.jpg",`${result}/result_${this.id}/data/${this.host[this.I]}.png`),this.I++,this.callme())}};callme=e=>{this.I!=this.url.length?this.screen():(file=Date.now().toString().slice(0,-8),pathd=`${result}/result_${this.id}`,urlpath=`${urls}/urls_${this.id}.txt`,fs.copyFileSync("html/index.html",`${result}/result_${this.id}/result.html`),fs.copyFileSync("html/read.txt",`${result}/result_${this.id}/important!!.txt`),fs.copyFileSync("logo/logox48.svg",`${result}/result_${this.id}/data/logox48.svg`),zipper.sync.zip(pathd).compress().save(file+".zip"),this.res.download(file+".zip",(e=>{e&&console.log("Error : ",e),fs.rmSync(pathd,{recursive:!0,force:!0}),fs.rmSync(urlpath,{recursive:!0,force:!0}),fs.rmSync(file+".zip",{recursive:!0,force:!0})})))}}app.post("/wait",((e,s)=>{new r(e.body,s).screen()})),app.listen(port,(()=>console.log(`Go To http://127.0.0.1:${port}`)))};
