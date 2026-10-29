const $ = (id) => document.getElementById(id);
let rows = [];
let charts = {};

const demo = [
 {person_id:"STU-1001",age:19,admission_grade:82,attendance_rate:92,gpa_semester_1:7.6,gpa_semester_2:8.2,missed_deadlines:1,dropout:0},
 {person_id:"STU-1002",age:20,admission_grade:74,attendance_rate:78,gpa_semester_1:7.1,gpa_semester_2:7.4,missed_deadlines:2,dropout:0},
 {person_id:"STU-1003",age:18,admission_grade:91,attendance_rate:96,gpa_semester_1:8.8,gpa_semester_2:9.1,missed_deadlines:0,dropout:0},
 {person_id:"STU-1004",age:21,admission_grade:58,attendance_rate:54,gpa_semester_1:5.2,gpa_semester_2:4.8,missed_deadlines:7,dropout:1},
 {person_id:"STU-1005",age:19,admission_grade:68,attendance_rate:72,gpa_semester_1:6.5,gpa_semester_2:6.2,missed_deadlines:4,dropout:0},
 {person_id:"STU-1006",age:22,admission_grade:61,attendance_rate:49,gpa_semester_1:4.9,gpa_semester_2:4.6,missed_deadlines:8,dropout:1},
 {person_id:"STU-1007",age:20,admission_grade:85,attendance_rate:88,gpa_semester_1:8.1,gpa_semester_2:8.4,missed_deadlines:1,dropout:0},
 {person_id:"STU-1008",age:19,admission_grade:77,attendance_rate:81,gpa_semester_1:7.5,gpa_semester_2:7.7,missed_deadlines:2,dropout:0},
 {person_id:"STU-1009",age:21,admission_grade:63,attendance_rate:66,gpa_semester_1:6.1,gpa_semester_2:5.8,missed_deadlines:5,dropout:0},
 {person_id:"STU-1010",age:18,admission_grade:89,attendance_rate:94,gpa_semester_1:8.5,gpa_semester_2:8.9,missed_deadlines:0,dropout:0},
 {person_id:"STU-1011",age:20,admission_grade:55,attendance_rate:58,gpa_semester_1:5.1,gpa_semester_2:4.9,missed_deadlines:6,dropout:1},
 {person_id:"STU-1012",age:19,admission_grade:80,attendance_rate:84,gpa_semester_1:7.8,gpa_semester_2:8.0,missed_deadlines:1,dropout:0}
];
const num = (r,k) => { const v=Number(r[k]); return r[k]!==undefined && r[k]!=="" && Number.isFinite(v) ? v : null; };
const avg = (arr) => { const a=arr.filter(v=>v!==null&&Number.isFinite(v)); return a.length?a.reduce((s,v)=>s+v,0)/a.length:0; };
const fmt = (n,d=1) => Number(n).toLocaleString(undefined,{maximumFractionDigits:d,minimumFractionDigits:d});
function status(r){const v=String(r.dropout??"0").trim().toLowerCase();return ["1","yes","true","dropout","dropped out"].includes(v)?1:0;}
function clean(r,i){return {...r,person_id:r.person_id||r.student_id||`STU-${String(i+1).padStart(4,"0")}`};}
function chart(id,type,data,options={}){if(charts[id])charts[id].destroy();const ctx=$(id);if(!ctx)return;charts[id]=new Chart(ctx,{type,data,options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:"#24233e",padding:11,cornerRadius:8}},...options}});}
const purple="#7664e8", coral="#ff8e9c", mint="#45c49a", grid="#f0f0f6", muted="#999aad";
function axisOpts(){return {x:{grid:{display:false},ticks:{color:muted,font:{size:10}},border:{display:false}},y:{grid:{color:grid},ticks:{color:muted,font:{size:10}},border:{display:false}}};}
function render(){
 const total=rows.length, drop=rows.filter(r=>status(r)===1).length;
 const att=rows.map(r=>num(r,"attendance_rate")).filter(v=>v!==null), gpa=rows.map(r=>num(r,"gpa_semester_2")).filter(v=>v!==null);
 $("totalStudents").textContent=total.toLocaleString();$("statusTotal").textContent=total.toLocaleString();
 $("avgAttendance").textContent=att.length?fmt(avg(att),1):"—";$("avgGpa").textContent=gpa.length?fmt(avg(gpa),2):"—";
 $("dropoutCount").textContent=drop.toLocaleString();$("dropoutRate").textContent=total?fmt(drop/total*100,1)+"%":"0%";
 $("qualityRows").textContent=total.toLocaleString();
 $("missingAttendance").textContent=rows.filter(r=>num(r,"attendance_rate")===null).length;
 const seen=new Set();let dup=0;rows.forEach(r=>{const k=JSON.stringify(r);if(seen.has(k))dup++;seen.add(k)});$("duplicateRows").textContent=dup;
 chart("gpaChart","line",{labels:["Semester 1","Semester 2"],datasets:[{data:[avg(rows.map(r=>num(r,"gpa_semester_1"))),avg(gpa)],borderColor:purple,backgroundColor:"#7664e81a",fill:true,tension:.38,borderWidth:3,pointRadius:5,pointBackgroundColor:"#fff",pointBorderWidth:2,pointBorderColor:purple}]},{scales:axisOpts()});
 chart("statusChart","doughnut",{labels:["Continuing","Dropout"],datasets:[{data:[total-drop,drop],backgroundColor:[purple,coral],borderWidth:0,hoverOffset:5}]},{cutout:"76%",plugins:{legend:{display:false}}});
 const bins=[0,0,0,0,0];att.forEach(v=>{if(v<50)bins[0]++;else if(v<60)bins[1]++;else if(v<75)bins[2]++;else if(v<90)bins[3]++;else bins[4]++;});
 chart("attendanceChart","bar",{labels:["<50%","50–59%","60–74%","75–89%","90%+"],datasets:[{data:bins,backgroundColor:["#ff9ca8","#ffb6a0","#f6cb8b","#a99df7","#6f5ce7"],borderRadius:6,maxBarThickness:34}]},{scales:axisOpts()});
 const grades=rows.map(r=>num(r,"admission_grade")).filter(v=>v!==null), gb=[0,0,0,0,0,0];grades.forEach(v=>{if(v<50)gb[0]++;else if(v<60)gb[1]++;else if(v<70)gb[2]++;else if(v<80)gb[3]++;else if(v<90)gb[4]++;else gb[5]++;});
 chart("gradeChart","bar",{labels:["<50","50–59","60–69","70–79","80–89","90+"],datasets:[{data:gb,backgroundColor:purple,borderRadius:6,maxBarThickness:36}]},{scales:axisOpts()});
 const scatter=rows.filter(r=>num(r,"attendance_rate")!==null&&num(r,"gpa_semester_2")!==null);
 chart("scatterChart","scatter",{datasets:[{label:"Continuing",data:scatter.filter(r=>!status(r)).map(r=>({x:num(r,"attendance_rate"),y:num(r,"gpa_semester_2")})),backgroundColor:purple,pointRadius:5},{label:"Dropout",data:scatter.filter(r=>status(r)).map(r=>({x:num(r,"attendance_rate"),y:num(r,"gpa_semester_2")})),backgroundColor:coral,pointRadius:5}]},{plugins:{legend:{display:true,position:"bottom",labels:{color:muted,usePointStyle:true,boxWidth:7,font:{size:10}}}},scales:{x:{...axisOpts().x,title:{display:true,text:"Attendance rate (%)",color:muted},min:0},y:{...axisOpts().y,title:{display:true,text:"Semester 2 GPA",color:muted}}}});
 const groups=[0,1].map(s=>avg(rows.filter(r=>status(r)===s).map(r=>num(r,"attendance_rate"))));
 chart("groupChart","bar",{labels:["Continuing","Dropout"],datasets:[{data:groups,backgroundColor:[purple,coral],borderRadius:6,maxBarThickness:48}]},{scales:{...axisOpts(),y:{...axisOpts().y,min:0,max:100}}});
 const hi=rows.filter(r=>{const a=num(r,"attendance_rate"),g=num(r,"gpa_semester_2");return (a!==null&&a<60)||(g!==null&&g<5)}).length;
 const med=rows.filter(r=>{const a=num(r,"attendance_rate"),g=num(r,"gpa_semester_2");return (a!==null&&a<75)||(g!==null&&g<6)}).length;
 $("highRiskCount").textContent=hi;$("mediumRiskCount").textContent=med;
 renderStudents();renderRisk();
 $("insights").innerHTML=`<div class="insight"><span class="insight-bullet purple-bg">↗</span><div><strong>Attendance average: ${fmt(avg(att),1)}%</strong><p>Compare attendance with GPA to explore engagement patterns.</p></div></div><div class="insight"><span class="insight-bullet orange-bg">!</span><div><strong>${hi} students flagged for review</strong><p>These records meet the dashboard's simple support rules.</p></div></div><div class="insight"><span class="insight-bullet green-bg">✓</span><div><strong>Look beyond the numbers</strong><p>Use trends to guide supportive conversations, not final decisions.</p></div></div>`;
}
function renderStudents(){
 const q=($("studentSearch").value||"").toLowerCase(), f=$("statusFilter").value;
 const filtered=rows.filter(r=>String(r.person_id).toLowerCase().includes(q)&& (f==="all"||String(status(r))===f));
 $("tableCount").textContent=`${filtered.length} matching records`;
 $("tableFootCount").textContent=`Showing ${Math.min(100,filtered.length)} of ${filtered.length} records`;
 $("studentRows").innerHTML=filtered.slice(0,100).map(r=>`<tr><td class="student-id">${esc(r.person_id)}</td><td>${val(r,"age",0)}</td><td>${val(r,"attendance_rate",1)}${num(r,"attendance_rate")===null?"":"%"}</td><td>${val(r,"gpa_semester_2",2)}</td><td>${val(r,"missed_deadlines",0)}</td><td><span class="status-badge ${status(r)?"status-dropout":"status-continuing"}">${status(r)?"Dropout":"Continuing"}</span></td></tr>`).join("")||'<tr><td colspan="6">No records match your search.</td></tr>';
}
function renderRisk(){
 const risk=rows.map(r=>{const a=num(r,"attendance_rate"),g=num(r,"gpa_semester_2");let level=((a!==null&&a<60)||(g!==null&&g<5))?"High":((a!==null&&a<75)||(g!==null&&g<6))?"Medium":"Low";return {...r,level};}).filter(r=>r.level!=="Low").sort((a,b)=>(a.level==="High"?0:1)-(b.level==="High"?0:1));
 $("riskRows").innerHTML=risk.slice(0,100).map(r=>`<tr><td class="student-id">${esc(r.person_id)}</td><td>${val(r,"attendance_rate",1)}${num(r,"attendance_rate")===null?"":"%"}</td><td>${val(r,"gpa_semester_2",2)}</td><td>${val(r,"missed_deadlines",0)}</td><td><span class="risk-badge ${r.level==="High"?"risk-high":"risk-medium"}">${r.level} review</span></td></tr>`).join("")||'<tr><td colspan="5">No students meet the current review rules.</td></tr>';
}
function val(r,k,d){const v=num(r,k);return v===null?"—":fmt(v,d);}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
document.querySelectorAll(".nav-item").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll(".nav-item").forEach(b=>b.classList.remove("active"));btn.classList.add("active");document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$("page-"+btn.dataset.page).classList.add("active");$("pageTitle").textContent=btn.textContent.trim().replace(/^[◫♙⌁◎]\s*/,"");setTimeout(()=>Object.values(charts).forEach(c=>c.resize()),50);}));
$("studentSearch").addEventListener("input",renderStudents);$("statusFilter").addEventListener("change",renderStudents);
$("csvInput").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;Papa.parse(file,{header:true,skipEmptyLines:true,dynamicTyping:true,complete:r=>{rows=r.data.map(clean);$("datasetStatus").textContent=`${file.name} imported`;render();},error:()=>{$("datasetStatus").textContent="Could not read CSV";}});});
rows=demo.map(clean);render();