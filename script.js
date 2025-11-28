// === WebShala.AI Platform JS ===

// Data: Free + Pro AI Tools
const TOOLS = [
  {id:'chatgpt',name:'ChatGPT',tier:'Free/Pro',link:'https://chat.openai.com/',
   desc:'Conversational AI that answers, explains and helps create content.',
   steps:['Ask questions clearly','Refine prompts','Get examples & quizzes'],
   prompt:'Explain AI in simple words for students.'},
  {id:'canva',name:'Canva Magic Studio',tier:'Free/Pro',link:'https://www.canva.com/',
   desc:'Create posters, slides, visuals using templates & AI design.',
   steps:['Choose a template','Use Magic Write','Export presentation'],
   prompt:'Design a poster on environmental awareness.'},
  {id:'perplexity',name:'Perplexity AI',tier:'Free',link:'https://www.perplexity.ai/',
   desc:'AI-powered search engine with citations for research.',
   steps:['Enter topic query','Read summaries','Use cited sources'],
   prompt:'Summarize advantages of solar energy with references.'},
  {id:'leonardo',name:'Leonardo.ai',tier:'Free/Pro',link:'https://leonardo.ai/',
   desc:'AI image generation platform for creative students.',
   steps:['Enter visual prompt','Generate design','Download best output'],
   prompt:'Create a futuristic classroom image.'},
  {id:'notion',name:'Notion AI',tier:'Free/Pro',link:'https://www.notion.so/',
   desc:'Summarize notes, create tasks and manage study material.',
   steps:['Paste notes','Summarize content','Organize in bullet form'],
   prompt:'Summarize notes on human digestive system.'},
  {id:'midjourney',name:'Midjourney',tier:'Pro',link:'https://www.midjourney.com/home/',
   desc:'AI image generation through Discord commands.',
   steps:['Join Discord','Enter /imagine prompts','Save generated image'],
   prompt:'A futuristic India led by AI-powered classrooms.'}
];

const $ = (s)=>document.querySelector(s);
const create = (t,c)=>{const e=document.createElement(t);if(c)e.className=c;return e;};

let STATE = JSON.parse(localStorage.getItem('webshala_state')||'{"schools":{}}');
function saveState(){localStorage.setItem('webshala_state',JSON.stringify(STATE));}

// Student Login
$('#stuLogin').onclick = ()=>{
  const name=$('#stuName').value.trim();
  const school=$('#stuSchool').value.trim()||'Demo School';
  if(!name)return alert('Enter your name');
  if(!STATE.schools[school])STATE.schools[school]={students:[]};
  let st=STATE.schools[school].students.find(s=>s.name===name);
  if(!st){st={name,progress:0,tools:[]};STATE.schools[school].students.push(st);saveState();}
  CURRENT={role:'student',name,school};
  openStudent();
};

// Teacher Login
$('#teacherLogin').onclick = ()=>{
  const school=$('#teacherSchool').value.trim();
  if(!school)return alert('Enter school name');
  CURRENT={role:'teacher',school};
  openTeacher();
};

// Open Student Dashboard
function openStudent(){
  $('#landing').classList.add('hide');
  $('#teacherDashboard').classList.add('hide');
  $('#studentDashboard').classList.remove('hide');
  $('#stuNameDisplay').innerText=CURRENT.name;
  $('#stuSchoolDisplay').innerText=CURRENT.school;
  renderCatalog();
  refreshProgress();
}

// Render Tool Catalog
function renderCatalog(){
  const catalog=$('#toolCatalog');catalog.innerHTML='';
  TOOLS.forEach(t=>{
    const it=create('div','item');
    it.innerHTML=`<strong>${t.name}</strong> <span class="small muted">(${t.tier})</span><br>
    <div class="small muted">${t.desc}</div>
    <button class="btn openBtn" data-id="${t.id}" style="margin-top:6px">Open</button>`;
    catalog.appendChild(it);
  });
}

// Handle tool open
document.body.addEventListener('click',e=>{
  if(e.target.classList.contains('openBtn')){
    const id=e.target.dataset.id;
    const tool=TOOLS.find(x=>x.id===id);
    showTool(tool);
  }
});

function showTool(tool){
  const box=$('#toolDetail');
  box.innerHTML=`<h3>${tool.name}</h3>
  <div class="muted small">${tool.desc}</div>
  <div style="margin-top:8px"><a href="${tool.link}" target="_blank" class="btn">Open Tool</a></div>
  <div class="tutorial" style="margin-top:10px">
    <h4>How it Works</h4>
    <ol>${tool.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <button id="completeBtn" class="btn" style="margin-top:8px">Mark Complete</button>
  </div>
  <div style="margin-top:10px">
    <h4>Try Prompt</h4>
    <textarea id="promptInput" style="width:100%;height:70px;border-radius:8px;background:#091a35;color:#fff;padding:8px;">${tool.prompt}</textarea>
    <button id="runPrompt" class="btn" style="margin-top:6px">Simulate</button>
    <div id="promptResult" style="margin-top:6px;background:#0002;padding:10px;border-radius:8px;">Result will appear here...</div>
  </div>`;
  
  $('#runPrompt').onclick=()=>{
    const prompt=$('#promptInput').value.trim();
    simulatePrompt(prompt);
  };
  $('#completeBtn').onclick=()=>completeLesson(tool.id);
}

function simulatePrompt(p){
  const out=$('#promptResult');out.innerText='';
  const txt=`Simulated AI response for:\n"${p}"\n\n👉 Example Output:\n"${p.split(' ')[0]} ... explained simply!"`;
  let i=0;const t=setInterval(()=>{out.innerText=txt.slice(0,i++);if(i>txt.length)clearInterval(t);},20);
}

// Complete button
function completeLesson(id){
  const s=STATE.schools[CURRENT.school].students.find(x=>x.name===CURRENT.name);
  if(!s.tools.includes(id))s.tools.push(id);
  s.progress=Math.min(100,(s.progress||0)+10);
  saveState();refreshProgress();
  alert('Progress Updated ✅');
}

function refreshProgress(){
  const s=STATE.schools[CURRENT.school].students.find(x=>x.name===CURRENT.name);
  $('#stuProgress').innerText=(s.progress||0)+'%';
}

// Teacher Dashboard
function openTeacher(){
  $('#landing').classList.add('hide');
  $('#studentDashboard').classList.add('hide');
  $('#teacherDashboard').classList.remove('hide');
  $('#teacherSchoolLabel').innerText=CURRENT.school;
  renderTeacherStudents();
}

function renderTeacherStudents(){
  const cont=$('#teacherStudents');
  cont.innerHTML='';
  const list=(STATE.schools[CURRENT.school]||{students:[]}).students;
  if(!list.length){cont.innerHTML='<div class="muted">No students yet.</div>';return;}
  list.forEach(s=>{
    const div=create('div','item');
    div.innerHTML=`<strong>${s.name}</strong> - ${s.progress}%<br><span class="small muted">${s.tools.join(', ')}</span>`;
    cont.appendChild(div);
  });
}

// Export CSV
$('#exportCSV').onclick=()=>{
  const list=(STATE.schools[CURRENT.school]||{students:[]}).students;
  let csv="Name,Progress,Tools\n";
  list.forEach(s=>{csv+=`${s.name},${s.progress},"${s.tools.join(';')}"\n`;});
  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='students.csv';a.click();
};

// Logout
$('#stuLogout').onclick=()=>{$('#studentDashboard').classList.add('hide');$('#landing').classList.remove('hide');};
$('#teacherLogout').onclick=()=>{$('#teacherDashboard').classList.add('hide');$('#landing').classList.remove('hide');};

// Chatbot
$('#openBot').onclick=()=>{$('#botPopup').style.display='flex';$('#botFrame').src='https://webshalatech.netlify.app/';};
$('#closeBot').onclick=()=>{$('#botPopup').style.display='none';$('#botFrame').src='about:blank';};

let CURRENT=null;
