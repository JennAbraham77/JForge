import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'node:crypto';
dotenv.config();
const app=express();app.use(cors({origin:'http://localhost:5173'}));app.use(express.json({limit:'8mb'}));
const secret=process.env.JWT_SECRET;
if(!secret || secret.length<32 || secret.includes('replace_this')){console.error('Set a secure JWT_SECRET in server/.env (32+ characters)');process.exit(1)}
const User=mongoose.model('User',new mongoose.Schema({name:{type:String,required:true,trim:true,maxlength:80},email:{type:String,required:true,unique:true,lowercase:true,trim:true},passwordHash:{type:String,required:true}},{timestamps:true}));
const Project=mongoose.model('Project',new mongoose.Schema({owner:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true,index:true},name:{type:String,required:true,maxlength:100},items:{type:[mongoose.Schema.Types.Mixed],default:[]},description:{type:String,default:'',maxlength:500},canvasBg:{type:String,default:'#fffdf2'},publishedSlug:{type:String,default:null,index:true}},{timestamps:true}));
const tokenFor=u=>jwt.sign({sub:String(u._id)},secret,{expiresIn:'7d'});
const auth=(req,res,next)=>{try{const token=(req.headers.authorization||'').replace(/^Bearer /,'');const data=jwt.verify(token,secret);req.userId=data.sub;next()}catch{res.status(401).json({error:'Please log in again.'})}};
const wrap=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
app.post('/api/auth/register',wrap(async(req,res)=>{const {name,email,password}=req.body;if(typeof name!=='string'||!name.trim()||name.length>80||typeof email!=='string'||!/^\S+@\S+\.\S+$/.test(email)||typeof password!=='string'||password.length<8)return res.status(400).json({error:'Enter a name, valid email and password of at least 8 characters.'});const normalized=email.trim().toLowerCase();if(await User.exists({email:normalized}))return res.status(409).json({error:'This email is already registered.'});const user=await User.create({name:name.trim(),email:normalized,passwordHash:await bcrypt.hash(password,12)});res.status(201).json({token:tokenFor(user),user:{id:user.id,name:user.name,email:user.email}})}));
app.post('/api/auth/login',wrap(async(req,res)=>{const {email,password}=req.body;if(typeof email!=='string'||typeof password!=='string')return res.status(400).json({error:'Invalid credentials.'});const user=await User.findOne({email:email.trim().toLowerCase()});if(!user||!(await bcrypt.compare(password,user.passwordHash)))return res.status(401).json({error:'Incorrect email or password.'});res.json({token:tokenFor(user),user:{id:user.id,name:user.name,email:user.email}})}));
app.get('/api/auth/me',auth,wrap(async(req,res)=>{const user=await User.findById(req.userId).select('name email');if(!user)return res.status(401).json({error:'User not found'});res.json({user:{id:user.id,name:user.name,email:user.email}})}));
const safeItems=v=>Array.isArray(v)&&v.length<=150&&v.every(x=>x&&typeof x==='object'&&['heading','paragraph','button','image','section','navbar','card','footer','contact','chatbot'].includes(x.type)&&typeof x.id==='string'&&x.id.length<100&&typeof x.text==='string'&&x.text.length<10000);
const asProject=p=>({id:p.id,name:p.name,description:p.description||'',canvasBg:p.canvasBg||'#fffdf2',publishedSlug:p.publishedSlug||'',items:p.items,updatedAt:p.updatedAt});
app.get('/api/projects',auth,wrap(async(req,res)=>{const projects=await Project.find({owner:req.userId}).sort({updatedAt:-1});res.json({projects:projects.map(asProject)})}));
app.post('/api/projects',auth,wrap(async(req,res)=>{const {name='Untitled Website',items=[],canvasBg='#fffdf2'}=req.body;if(typeof name!=='string'||!name.trim()||name.length>100||!safeItems(items))return res.status(400).json({error:'Invalid project data'});const p=await Project.create({owner:req.userId,name:name.trim(),items,canvasBg:color(canvasBg,'#fffdf2')});res.status(201).json({project:asProject(p)})}));
app.put('/api/projects/:id',auth,wrap(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(404).json({error:'Project not found'});const {name,items,description='',canvasBg='#fffdf2'}=req.body;if(typeof description!=='string'||description.length>500)return res.status(400).json({error:'Invalid description'});if(typeof name!=='string'||!name.trim()||name.length>100||!safeItems(items))return res.status(400).json({error:'Invalid project data'});const p=await Project.findOneAndUpdate({_id:req.params.id,owner:req.userId},{name:name.trim(),description,items,canvasBg:color(canvasBg,'#fffdf2')},{new:true,runValidators:true});if(!p)return res.status(404).json({error:'Project not found'});res.json({project:asProject(p)})}));
app.delete('/api/projects/:id',auth,wrap(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(404).json({error:'Project not found'});const p=await Project.findOneAndDelete({_id:req.params.id,owner:req.userId});if(!p)return res.status(404).json({error:'Project not found'});res.json({success:true})}));
app.post('/api/projects/:id/publish',auth,wrap(async(req,res)=>{if(!mongoose.isValidObjectId(req.params.id))return res.status(404).json({error:'Project not found'});const p=await Project.findOne({_id:req.params.id,owner:req.userId});if(!p)return res.status(404).json({error:'Project not found'});if(!p.publishedSlug)p.publishedSlug=crypto.randomBytes(12).toString('hex');await p.save();res.json({project:asProject(p)})}));
const esc=v=>String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fonts=['Georgia','Arial','Verdana','Trebuchet MS','Times New Roman','Courier New','Palatino Linotype','Comic Sans MS'];const font=v=>fonts.includes(v)?v:'Georgia';
const color=(v,f)=>/^#[a-f0-9]{6}$/i.test(v||'')?v:f;
app.get('/site/:slug',wrap(async(req,res)=>{const p=await Project.findOne({publishedSlug:req.params.slug});if(!p)return res.status(404).send('Site not found');const body=p.items.map(x=>{const t=esc(x.text),fg=color(x.color,'#222222'),bg=color(x.bg,'#f0efff'),align=['left','center','right'].includes(x.align)?x.align:'left',typography=`font-family:'${font(x.fontFamily)}';font-size:${Math.max(12,Math.min(96,Number(x.fontSize)||16))}px`;if(x.type==='heading')return `<h1 style="color:${fg};text-align:${align};${typography}">${t}</h1>`;if(x.type==='paragraph')return `<p style="color:${fg};text-align:${align};${typography}">${t}</p>`;if(x.type==='image'){const src=typeof x.src==='string'&&(x.src.startsWith('https://')||/^data:image\/(png|jpeg|gif|webp);base64,[a-zA-Z0-9+/=]+$/.test(x.src))?x.src:'';return `<img alt="Website image" src="${esc(src)}">`}if(x.type==='button')return `<div style="text-align:${align}"><button style="background:${bg};color:${fg};${typography}">${t}</button></div>`;if(x.type==='contact')return `<form><h2>${t}</h2><input placeholder="Name"><input placeholder="Email"><textarea placeholder="Message"></textarea><button type="button">Demo form</button></form>`;const tag=({navbar:'nav',footer:'footer',card:'article'})[x.type]||'section';return `<${tag} style="background:${bg};color:${fg};text-align:${align};${typography}">${t}</${tag}>`}).join('');res.set('Content-Security-Policy',"default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'");res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.name)}</title><style>body{background:${color(p.canvasBg,'#fffdf2')};font-family:Georgia,serif;max-width:960px;margin:40px auto;padding:20px}section,nav,article,footer,form{padding:26px;margin:16px 0;border-radius:12px}img{max-width:100%;height:auto}button{padding:12px 22px;border:0;border-radius:8px}input,textarea{display:block;margin:10px 0;padding:12px;width:90%;max-width:500px}@media(max-width:600px){body{margin:0}}</style></head><body>${body}</body></html>`)}));

const aiHits=new Map();
function aiLimit(req,res,next){
  const key=req.userId||req.ip||'unknown',now=Date.now();
  const hit=aiHits.get(key)||{count:0,until:now+60000};
  if(now>hit.until){hit.count=0;hit.until=now+60000}
  if(++hit.count>12)return res.status(429).json({error:'AI request limit reached. Try again in a minute.'});
  aiHits.set(key,hit);next();
}
async function gemini(prompt){
  const apiKey=process.env.GEMINI_API_KEY;
  if(!apiKey)throw new Error('GEMINI_API_KEY is missing from server/.env');
  const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
  const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{
    method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},
    body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{temperature:0.65,maxOutputTokens:2500}}),
    signal:AbortSignal.timeout(30000)
  });
  const data=await response.json();
  if(!response.ok)throw new Error(data.error?.message||'Gemini request failed');
  const answer=data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
  if(!answer)throw new Error('Gemini did not return text');
  return answer;
}
function aiInput(req,res,next){
  const value=req.body?.prompt;
  if(typeof value!=='string'||!value.trim()||value.length>3000)return res.status(400).json({error:'Enter a prompt under 3000 characters.'});
  req.aiPrompt=value.trim();next();
}
function parseAIJson(value){
  const clean=value.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
  return JSON.parse(clean);
}
app.post('/api/ai/content',auth,aiLimit,aiInput,wrap(async(req,res)=>{
  const mode=['improve','shorten','expand','professional','friendly','generate'].includes(req.body.mode)?req.body.mode:'improve';
  const answer=await gemini(`You are a website copywriter. Task: ${mode}. Return only the revised website copy, without quotation marks, markdown or explanations. User content or request:\n${req.aiPrompt}`);
  res.json({text:answer.slice(0,10000)});
}));
app.post('/api/ai/generate',auth,aiLimit,aiInput,wrap(async(req,res)=>{
  const answer=await gemini(`You create small single-page website layouts. Return ONLY valid JSON: {"items":[{"type":"heading|paragraph|button|section|navbar|card|footer|contact","text":"...","color":"#rrggbb","bg":"#rrggbb","align":"left|center|right","fontSize":24}],"canvasBg":"#rrggbb"}. Create 5-9 cohesive components in logical order, including a heading, paragraph, CTA and footer. Use attractive accessible colors. No images, HTML, scripts or markdown. User request:\n${req.aiPrompt}`);
  let parsed;try{parsed=parseAIJson(answer)}catch{return res.status(502).json({error:'AI generated invalid website data. Please retry.'})}
  const allowed=['heading','paragraph','button','section','navbar','card','footer','contact'];
  const items=(Array.isArray(parsed.items)?parsed.items:[]).slice(0,12).filter(x=>x&&allowed.includes(x.type)&&typeof x.text==='string').map(x=>({id:crypto.randomUUID(),type:x.type,text:x.text.slice(0,1500),color:color(x.color,'#493223'),bg:color(x.bg,'#fff1c7'),align:['left','center','right'].includes(x.align)?x.align:'center',fontFamily:'Georgia',fontSize:Math.max(12,Math.min(72,Number(x.fontSize)|| (x.type==='heading'?42:17)))}));
  if(!items.length)return res.status(502).json({error:'AI did not generate usable website components.'});
  res.json({items,canvasBg:color(parsed.canvasBg,'#fffdf2')});
}));
app.post('/api/ai/design',auth,aiLimit,wrap(async(req,res)=>{
  const items=req.body?.items;
  if(!Array.isArray(items)||items.length>150)return res.status(400).json({error:'Invalid design components.'});
  const brief=items.slice(0,25).map(x=>({type:String(x.type||'').slice(0,30),text:String(x.text||'').slice(0,180)}));
  const answer=await gemini(`Act as an accessible web designer. Return ONLY JSON: {"canvasBg":"#rrggbb","textColor":"#rrggbb","accentColor":"#rrggbb","fontFamily":"Georgia|Arial|Verdana|Trebuchet MS|Times New Roman|Courier New|Palatino Linotype|Comic Sans MS","advice":"2-3 sentences"}. Suggest a coordinated palette and typography based on these components: ${JSON.stringify(brief)}`);
  let parsed;try{parsed=parseAIJson(answer)}catch{return res.status(502).json({error:'AI generated invalid design suggestions. Please retry.'})}
  const fonts=['Georgia','Arial','Verdana','Trebuchet MS','Times New Roman','Courier New','Palatino Linotype','Comic Sans MS'];
  res.json({suggestion:{canvasBg:color(parsed.canvasBg,'#fffdf2'),textColor:color(parsed.textColor,'#493223'),accentColor:color(parsed.accentColor,'#b27d45'),fontFamily:fonts.includes(parsed.fontFamily)?parsed.fontFamily:'Georgia',advice:String(parsed.advice||'').slice(0,800)}});
}));
app.post('/api/ai/chat',auth,aiLimit,wrap(async(req,res)=>{
  const {message,botName='Website Assistant',instructions='',websiteContext=''}=req.body||{};
  if(typeof message!=='string'||!message.trim()||message.length>1200)return res.status(400).json({error:'Message must be under 1200 characters.'});
  const answer=await gemini(`You are ${String(botName).slice(0,70)}, a helpful website chatbot. Follow these website instructions when safe: ${String(instructions).slice(0,1200)}. Website context: ${String(websiteContext).slice(0,1800)}. Never claim to have taken actions or collected orders. Answer briefly and accurately. Visitor message: ${message}`);
  res.json({reply:answer.slice(0,2500)});
}));

app.get('/api/health',(_req,res)=>res.json({ok:true}));
app.use((err,req,res,next)=>{console.error(err);if(err.name==='TimeoutError')return res.status(504).json({error:'AI request timed out.'});if(err.message?.includes('GEMINI_API_KEY'))return res.status(503).json({error:'AI is not configured. Add GEMINI_API_KEY to server/.env.'});if(err.code===11000)return res.status(409).json({error:'This email is already registered.'});res.status(500).json({error:'Server error. Please try again.'})});
try{await mongoose.connect(process.env.MONGO_URI||'mongodb://127.0.0.1:27017/webforge');app.listen(process.env.PORT||5000,()=>console.log('WebForge API running on http://localhost:'+(process.env.PORT||5000)))}catch(e){console.error('MongoDB connection failed:',e.message);process.exit(1)}
