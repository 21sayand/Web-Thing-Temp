const $ = id => document.getElementById(id);
const DEF=$('pv').src;
const sems = [8.2, 8.5, 8.7, 8.4, 8.9, 9.0];
const subs = [["Subject 1",42,44],["Subject 2",40,45],["Subject 3",38,41],["Subject 4",46,47],["Subject 5",43,42]];

// build tables
$('sg').tBodies[0].innerHTML = sems.map((v,i)=>`<tr><td>Semester ${i+1}</td><td><input type="number" class="sgpa" min="0" max="10" step="0.01" value="${v}"></td></tr>`).join('');
$('im').tBodies[0].innerHTML = subs.map(s=>`<tr><td><input type="text" style="width:120px" value="${s[0]}"></td><td><input type="number" class="i1" min="0" max="50" value="${s[1]}"></td><td><input type="number" class="i2" min="0" max="50" value="${s[2]}"></td><td class="avg">-</td></tr>`).join('');

function calc(){
  const g=[...document.querySelectorAll('.sgpa')].map(i=>parseFloat(i.value)).filter(v=>!isNaN(v));
  $('cgpa').textContent = g.length ? (g.reduce((a,b)=>a+b,0)/g.length).toFixed(2) : '-';
  let tot=0,n=0;
  document.querySelectorAll('#im tbody tr').forEach(r=>{
    const a=parseFloat(r.querySelector('.i1').value), b=parseFloat(r.querySelector('.i2').value);
    if(!isNaN(a)&&!isNaN(b)){const av=(a+b)/2;r.querySelector('.avg').textContent=av.toFixed(1);tot+=av;n++}
    else r.querySelector('.avg').textContent='-';
  });
  $('iavg').textContent = n ? (tot/n).toFixed(1)+' / 50' : '-';
}
document.querySelectorAll('table input').forEach(i=>i.addEventListener('input',calc));
calc();

// photo preview
$('photo').addEventListener('change',e=>{
  const f=e.target.files[0]; if(!f) return;
  if(!f.type.startsWith('image/')){alert('Please choose an image file.');e.target.value='';return}
  const r=new FileReader(); r.onload=ev=>$('pv').src=ev.target.result; r.readAsDataURL(f);
});

$('bio').addEventListener('input',()=>$('c-bio').textContent=$('bio').value.length+' / 200');
$('clr').addEventListener('click',()=>document.querySelectorAll('#skills input,#acts input').forEach(c=>c.checked=false));

const err=(k,m)=>{$('e-'+k).textContent=m;return !m};
function validate(){
  let ok=true;
  ok&=err('name',/^[A-Za-z][A-Za-z .]{2,}$/.test($('name').value.trim())?'':'Enter a valid name (letters only, min 3).');
  ok&=err('roll',/^[A-Za-z0-9\-\/]{4,15}$/.test($('roll').value.trim())?'':'Enter a valid register number.');
  const d=$('dob').value;
  ok&=err('dob',d && new Date(d)<new Date() ?'':'Select a valid date of birth.');
  ok&=err('email',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($('email').value.trim())?'':'Enter a valid email.');
  ok&=err('phone',/^[6-9]\d{9}$/.test($('phone').value)?'':'Enter a 10-digit mobile number starting with 6-9.');
  ok&=err('dept',$('dept').value?'':'Select department.');
  ok&=err('gender',document.querySelector('input[name=gender]:checked')?'':'Select a gender.');
  ok&=err('blood',$('blood').value?'':'Select blood group.');
  ok&=err('c1',$('c1').value?'':'Select your first choice.');
  ok&=err('c2',($('c2').value && $('c2').value===$('c1').value)?'Choose a different company.':'');
  const bad=[...document.querySelectorAll('.sgpa')].some(i=>i.value===''||i.value<0||i.value>10)||
            [...document.querySelectorAll('.i1,.i2')].some(i=>i.value===''||i.value<0||i.value>50);
  ok&=err('marks',bad?'Check marks: SGPA must be 0-10 and internals 0-50.':'');
  ok&=err('skills',document.querySelectorAll('#skills input:checked').length?'':'Select at least one skill.');
  return !!ok;
}

const checked=id=>[...document.querySelectorAll('#'+id+' input:checked')].map(c=>c.value).join(', ')||'None';
$('f').addEventListener('submit',e=>{
  e.preventDefault(); $('ok').textContent='';
  if(!validate()){$('ok').textContent='';$('summary').style.display='none';return}
  const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  $('sum-body').innerHTML=`
    <div class="top"><img class="photo" src="${$('pv').src}" alt="">
    <div>
    <p><strong>${esc($('name').value.trim())}</strong> (${esc($('roll').value.trim())})</p>
    <p>${esc($('dept').value)} | ${document.querySelector('input[name=gender]:checked').value} | Blood group ${$('blood').value}</p>
    <p>${esc($('email').value)} | ${$('phone').value} | DOB: ${$('dob').value}</p></div></div>
    <p><strong>CGPA:</strong> ${$('cgpa').textContent} &nbsp; <strong>Internal avg:</strong> ${$('iavg').textContent}</p>
    <p><strong>Companies:</strong> ${$('c1').value}${$('c2').value?', '+$('c2').value:''}</p>
    <p><strong>Skills:</strong> ${esc(checked('skills'))}</p>
    <p><strong>Activities:</strong> ${esc(checked('acts'))}</p>
    ${$('bio').value?`<p><strong>Bio:</strong> ${esc($('bio').value)}</p>`:''}`;
  $('summary').style.display='block';
  $('ok').textContent='✔ Profile submitted successfully!';
  $('summary').scrollIntoView({behavior:'smooth'});
});

$('f').addEventListener('reset',()=>{
  setTimeout(()=>{document.querySelectorAll('.err').forEach(x=>{if(x.id.startsWith('e-'))x.textContent=''});
  $('pv').src=DEF;$('summary').style.display='none';$('ok').textContent='';$('c-bio').textContent='0 / 200';calc()},0);
});
