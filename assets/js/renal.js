let renalChartInstance = null;

function analyzeRenal(){

let age = parseFloat(document.getElementById("age").value);
let weight = parseFloat(document.getElementById("weight").value);
let sex = document.getElementById("sex").value;

let creatinine = parseFloat(document.getElementById("creatinine").value);
let unit = document.getElementById("creatUnit").value;

if(isNaN(age) || isNaN(creatinine)){
alert("Age and Creatinine required");
return;
}

/* Convert µmol/L to mg/dL */
if(unit === "umol"){
creatinine = creatinine / 88.4;
}

/* Sex parameters */
let k = (sex === "female") ? 0.7 : 0.9;
let alpha = (sex === "female") ? -0.241 : -0.302;
let sexFactor = (sex === "female") ? 1.012 : 1;

/* CKD-EPI 2021 */
let egfr_ckd =
142 *
Math.pow(Math.min(creatinine/k,1), alpha) *
Math.pow(Math.max(creatinine/k,1), -1.200) *
Math.pow(0.9938, age) *
sexFactor;

/* MDRD */
let egfr_mdrd =
175 *
Math.pow(creatinine, -1.154) *
Math.pow(age, -0.203) *
(sex === "female" ? 0.742 : 1);

/* Cockcroft–Gault */
let crcl = 0;
if(!isNaN(weight)){
crcl = ((140 - age) * weight) / (72 * creatinine);
if(sex === "female"){ crcl *= 0.85; }
}

/* BIS-1 */
let egfr_bis =
3736 *
Math.pow(creatinine, -0.87) *
Math.pow(age, -0.95) *
(sex === "female" ? 0.82 : 1);

/* CKD Stage */
function stage(gfr){
if(gfr >= 90) return "G1 (Normal)";
if(gfr >= 60) return "G2 (Mild)";
if(gfr >= 45) return "G3a";
if(gfr >= 30) return "G3b";
if(gfr >= 15) return "G4 (Severe)";
return "G5 (Failure)";
}

/* Stage Color */
function stageColor(gfr){
if(gfr >= 90) return "#22c55e";
if(gfr >= 60) return "#84cc16";
if(gfr >= 45) return "#facc15";
if(gfr >= 30) return "#f97316";
if(gfr >= 15) return "#ef4444";
return "#7f1d1d";
}

/* Output */
let outputHTML = `
<div style="background:${stageColor(egfr_ckd)};padding:15px;border-radius:12px;color:white;margin-bottom:15px;">
<div style="font-size:22px;font-weight:bold;">
CKD-EPI 2021: ${egfr_ckd.toFixed(1)} mL/min/1.73m²
</div>
<div>Stage: ${stage(egfr_ckd)}</div>
</div>

<div style="background:#1e293b;padding:15px;border-radius:12px;margin-bottom:15px;color:white;">
<p><b>MDRD:</b> ${egfr_mdrd.toFixed(1)}</p>
<p><b>Cockcroft–Gault:</b> ${crcl ? crcl.toFixed(1) : "Weight required"}</p>
<p><b>BIS-1:</b> ${egfr_bis.toFixed(1)}</p>
</div>
`;

document.getElementById("renalOutput").innerHTML = outputHTML;

/* Chart */
if(renalChartInstance !== null){
renalChartInstance.destroy();
}

let ctx = document.getElementById("renalChart").getContext("2d");

renalChartInstance = new Chart(ctx,{
type:'bar',
data:{
labels:['CKD-EPI','MDRD','Cockcroft','BIS-1'],
datasets:[{
label:'Renal Function Comparison',
data:[
egfr_ckd,
egfr_mdrd,
crcl || 0,
egfr_bis
],
backgroundColor:[
'#38bdf8',
'#84cc16',
'#facc15',
'#f97316'
]
}]
},
options:{
responsive:true,
plugins:{legend:{labels:{color:'white'}}},
scales:{y:{beginAtZero:true}}
}
});

}
