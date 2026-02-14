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

if(unit === "umol"){
creatinine = creatinine / 88.4;
}

/* CKD-EPI 2021 */
let k = (sex === "female") ? 0.7 : 0.9;
let alpha = (sex === "female") ? -0.241 : -0.302;
let sexFactor = (sex === "female") ? 1.012 : 1;

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
let crcl = "Weight required";
if(!isNaN(weight)){
let temp = ((140 - age) * weight) / (72 * creatinine);
if(sex === "female"){ temp *= 0.85; }
crcl = temp.toFixed(1);
}

/* BIS-1 */
let egfr_bis =
3736 *
Math.pow(creatinine, -0.87) *
Math.pow(age, -0.95) *
(sex === "female" ? 0.82 : 1);

/* Stage */
function stage(gfr){
if(gfr >= 90) return "G1";
if(gfr >= 60) return "G2";
if(gfr >= 45) return "G3a";
if(gfr >= 30) return "G3b";
if(gfr >= 15) return "G4";
return "G5";
}

/* Output */
document.getElementById("renalOutput").innerHTML =
"<h2>CKD-EPI 2021: " + egfr_ckd.toFixed(1) + " (" + stage(egfr_ckd) + ")</h2>" +
"<p>MDRD: " + egfr_mdrd.toFixed(1) + "</p>" +
"<p>Cockcroft–Gault: " + crcl + "</p>" +
"<p>BIS-1: " + egfr_bis.toFixed(1) + "</p>";

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
label:'Renal Comparison',
data:[
egfr_ckd,
egfr_mdrd,
(crcl === "Weight required") ? 0 : parseFloat(crcl),
egfr_bis
],
backgroundColor:['#38bdf8','#84cc16','#facc15','#f97316']
}]
},
options:{responsive:true}
});

}
