/* ============ RESULT DATA ============ */
const results = {
  "S3":{ sgpa:"8.00", subjects:[
    ["CST205","Object Oriented Programming using Java","4.00","A+","9.0"],
    ["EST200","Design & Engineering","2.00","A+","9.0"],
    ["MCN201","Sustainable Engineering","1.00","B+","8.0"],
    ["MAT203","Discrete Mathematical Structures","4.00","P","5.5"],
    ["CST201","Data Structures","4.00","C+","7.0"],
    ["CST203","Logic System Design","4.00","A","8.5"],
    ["CSL201","Data Structures Lab","2.00","A+","9.0"],
    ["CSL203","Object Oriented Programming Lab","2.00","S","10.0"]
  ]},
  "S4":{ sgpa:"8.58", subjects:[
    ["MAT206","Graph Theory","4.00","S","10.0"],
    ["CST202","Computer Organization & Architecture","4.00","B","7.5"],
    ["CST204","Database Management Systems","4.00","A+","9.0"],
    ["HUT200","Professional Ethics","2.00","B+","8.0"],
    ["MCN202","Constitution of India","0.50","B+","8.0"],
    ["CSL202","Digital Lab","2.00","S","10.0"],
    ["CSL204","Operating System Lab","2.00","C","6.5"],
    ["CST206","Operating Systems","4.00","A","8.5"]
  ]},
  "S5":{ sgpa:"7.77", subjects:[
    ["MCN301","Disaster Management","0.50","S","10.0"],
    ["CST301","Formal Languages & Automata Theory","4.00","C+","7.0"],
    ["CST303","Computer Networks","4.00","C+","7.0"],
    ["CST305","System Software","4.00","B","7.5"],
    ["CST307","Microprocessors & Microcontrollers","4.00","B+","8.0"],
    ["CST309","Management of Software Systems","3.00","C","6.5"],
    ["CSL331","System Software & Microprocessors Lab","2.00","S","10.0"],
    ["CSL333","Database Management System Lab","2.00","S","10.0"]
  ]},
  "S6":{ sgpa:"8.09", subjects:[
    ["CST302","Compiler Design","4.00","B+","8.0"],
    ["CST304","Computer Graphics & Image Processing","4.00","B","7.5"],
    ["CST306","Algorithm Analysis & Design","4.00","C","6.5"],
    ["HUT300","Industrial Economics & Foreign Trade","3.00","A","8.5"],
    ["CST308","Comprehensive Course Work","1.00","P","5.5"],
    ["CST362","Programming in Python","3.00","A+","9.0"],
    ["CSL332","Networking Lab","2.00","S","10.0"],
    ["CSD334","Mini Project","2.00","S","10.0"]
  ]}
};

const gradeClass = g => ({
  "S":"g-s","A+":"g-ap","A":"g-a","B+":"g-bp","B":"g-b",
  "C+":"g-cp","C":"g-c","P":"g-p"
}[g]||"g-c");

/* ============ DOM refs ============ */
const $ = id => document.getElementById(id);
const photoInput = $('studentPhoto');
const formPhoto    = $('formPhotoPreview');
const formInitials = $('formInitials');
const bannerPhoto  = $('bannerPhoto');
const bannerInit   = $('bannerInitials');
const dossierPhoto = $('dossierPhoto');
const dossierInit  = $('dossierInitials');
const resetPhoto   = $('resetPhotoBtn');

const inputs = {
  name:$('fullName'), reg:$('regNo'), dob:$('dob'), phone:$('phone'),
  email:$('email'), address:$('address'), blood:$('bloodGroup'),
  primary:$('primaryCompany'), secondary:$('secondaryCompany')
};
const radios = document.querySelectorAll('input[name="gender"]');

/* ============ PHOTO UPLOAD ============ */
let currentPhoto = '';
function setPhoto(src){
  currentPhoto = src;
  const set = (img,init) => {
    if(src){ img.src=src; img.style.display='block'; init.style.display='none'; }
    else   { img.style.display='none'; init.style.display='flex'; }
  };
  set(formPhoto, formInitials);
  set(bannerPhoto, bannerInit);
  set(dossierPhoto, dossierInit);
  resetPhoto.style.display = src ? 'inline-block' : 'none';
}

photoInput.addEventListener('change', () => {
  const f = photoInput.files[0];
  if(!f) return;
  if(!f.type.startsWith('image/')){ showToast('⚠ Please choose an image file'); return; }
  const r = new FileReader();
  r.onload = e => setPhoto(e.target.result);
  r.readAsDataURL(f);
});
resetPhoto.addEventListener('click', () => { photoInput.value=''; setPhoto(''); });

/* ============ RENDER RESULTS IN DOSSIER ============ */
function renderDossierResults(){
  const tbody = $('dossierResultBody');
  let html = '';
  Object.keys(results).forEach(sem => {
    const data = results[sem];
    html += `<tr class="sem-head"><td colspan="5">Semester ${sem} &nbsp;•&nbsp; SGPA ${data.sgpa}</td></tr>`;
    data.subjects.forEach((s,i) => {
      html += `<tr><td>${i+1}</td><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td><span class="grade-pill ${gradeClass(s[3])}">${s[3]}</span></td></tr>`;
    });
  });
  tbody.innerHTML = html;
}
renderDossierResults();

/* ============ LIVE SYNC DOSSIER ============ */
function syncDossier(){
  $('dName').textContent    = inputs.name.value.trim() || '—';
  $('dRegNo').textContent   = inputs.reg.value.trim() || '—';
  $('dEmail').textContent   = inputs.email.value.trim() || '—';
  $('dPhone').textContent   = inputs.phone.value.trim() || '—';
  $('dAddress').textContent = inputs.address.value.trim() || '—';

  const dobVal = inputs.dob.value;
  $('dDob').textContent = dobVal ? new Date(dobVal).toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,' / ') : '—';

  const gender = [...radios].find(r=>r.checked)?.value || '—';
  $('dGender').textContent = gender;
  $('dGenderTag').textContent = gender==='Male'?'♂ Male':gender==='Female'?'♀ Female':'✦ Other';

  const blood = inputs.blood.value;
  $('dBlood').textContent = blood || '—';
  $('dBloodTag').textContent = blood ? '🩸 '+blood : '—';

  const p = inputs.primary.value;
  const s = inputs.secondary.value;
  $('dPrimary').textContent   = p || '—';
  $('dSecondary').textContent = s || '—';

  // name in header / dossier id
  $('bannerName').textContent   = inputs.name.value.trim() || 'Student Name';
  $('dossierName').textContent  = inputs.name.value.trim() || 'Student Name';
  $('dossierMeta').textContent  = `Reg No: ${inputs.reg.value.trim() || '—'} • BTech CSE`;

  // initials
  const init = inputs.name.value.trim().split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase() || 'AP';
  [formInitials,bannerInit,dossierInit].forEach(el=>el.textContent=init);

  // skills & activities
  const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(c=>c.value);
  $('dSkills').innerHTML = skills.length ? skills.map(s=>`<span class="d-chip">${s}</span>`).join('') : '<span class="d-chip" style="opacity:.6">No skills selected</span>';
  const acts = [...document.querySelectorAll('input[name="activities"]:checked')].map(c=>c.value);
  $('dActivities').innerHTML = acts.length ? acts.map(a=>`<span class="d-chip">${a}</span>`).join('') : '<span class="d-chip" style="opacity:.6">No activities selected</span>';
}

// attach listeners
Object.values(inputs).forEach(el => el.addEventListener('input', syncDossier));
Object.values(inputs).forEach(el => el.addEventListener('change', syncDossier));
radios.forEach(r => r.addEventListener('change', syncDossier));
document.querySelectorAll('input[name="skills"], input[name="activities"]').forEach(c=>c.addEventListener('change', syncDossier));

/* ============ VALIDATION ============ */
const form = $('studentProfileForm');
function setValid(el, ok){
  el.classList.toggle('invalid', !ok);
  const err = el.parentElement.querySelector('.error-msg[data-for="'+el.id+'"]');
  if(err) err.style.display = ok ? 'none' : 'block';
  return ok;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  ok = setValid(inputs.name, /^[A-Za-z\s.'-]{3,}$/.test(inputs.name.value.trim())) && ok;
  ok = setValid(inputs.reg, /^[A-Za-z0-9]{6,}$/.test(inputs.reg.value.trim())) && ok;
  ok = setValid(inputs.dob, !!inputs.dob.value) && ok;
  ok = setValid(inputs.phone, /^[6-9]\d{9}$/.test(inputs.phone.value.trim())) && ok;
  ok = setValid(inputs.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inputs.email.value.trim())) && ok;
  ok = setValid(inputs.address, inputs.address.value.trim().length >= 5) && ok;
  ok = setValid(inputs.blood, !!inputs.blood.value) && ok;
  ok = setValid(inputs.primary, !!inputs.primary.value) && ok;

  if(ok) showToast('✔ Profile saved & dossier updated!');
  else   showToast('⚠ Please fix the highlighted fields');
});

/* ============ RESET ============ */
$('resetBtn').addEventListener('click', () => {
  if(!confirm('Reset all fields to original college defaults?')) return;
  form.reset();
  setPhoto('');
  document.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid'));
  document.querySelectorAll('.error-msg').forEach(el=>el.style.display='none');
  syncDossier();
  showToast('↺ Form reset to defaults');
});

/* ============ LOAD DEFAULTS ============ */
const defaults = {
  name:'Anusree Prakashan', reg:'LSTM23CS058', dob:'2002-11-05',
  phone:'8848198404', email:'anusreeprakashan1105@gmail.com',
  address:'Prarthana, P.O. Palayad', blood:'O+',
  primary:'TCS (Tata Consultancy Services)', secondary:'Infosys'
};
$('loadDefaultsBtn').addEventListener('click', () => {
  inputs.name.value = defaults.name;
  inputs.reg.value = defaults.reg;
  inputs.dob.value = defaults.dob;
  inputs.phone.value = defaults.phone;
  inputs.email.value = defaults.email;
  inputs.address.value = defaults.address;
  inputs.blood.value = defaults.blood;
  inputs.primary.value = defaults.primary;
  inputs.secondary.value = defaults.secondary;
  document.querySelector('input[name="gender"][value="Female"]').checked = true;
  // re-check default skills
  document.querySelectorAll('input[name="skills"]').forEach(c=>c.checked=false);
  ['Python','Java (OOP)','SQL / MySQL','Data Structures & Algorithms','DBMS','MS Office / Excel'].forEach(v=>{
    const c = document.querySelector('input[name="skills"][value="'+v+'"]');
    if(c) c.checked = true;
  });
  document.querySelectorAll('input[name="activities"]').forEach(c=>c.checked=false);
  document.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid'));
  document.querySelectorAll('.error-msg').forEach(el=>el.style.display='none');
  syncDossier();
  showToast('↺ College defaults reloaded');
});

/* ============ TOAST ============ */
let toastTimer;
function showToast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'),2600);
}

/* ============ INIT ============ */
$('dDate').textContent = new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
syncDossier();
