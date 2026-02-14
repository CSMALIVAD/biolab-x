let renalChartInstance = null;

function analyzeRenal(){

let age = parseFloat(document.getElementById("age").value);
let weight = parseFloat(document.getElementById("weight").value);
let sex = document.getElementById("sex").value;

let creatinine = parseFloat(document.getElementById("creatinine").value);
let unit = document.getElementById("creatUnit").value;

let bun = parseFloat(document.getElementById("bun").value);
let sodium = parseFloat(document.getElementById("sodium").value);
let glucose = parseFloat(document.getElementById("glucose").value);

if(isNaN(age) || isNaN(creatinine)){
alert("Age and Creatinine required");
return;
}

/* Convert µmol to mg/dL */
if(unit === "umol"){
creatinine = creatinine / 88.4;
}

/* CKD-EPI 2021 */
let k = (sex === "female") ? 0.7 : 0.9;
let alpha = (sex === "female") ? -0.241 : -0.302;
let sexFactor = (sex === "female") ? 1.012 : 1;

let egfr =
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

/* Cockcroft-Gault */
let crcl =
((140 - age) * weight) / (72 * creatinine);
if(sex === "female"){ crcl *= 0.85; }

/* BIS-1 */
let egfr_bis =
3736 *
Math.pow(creatinine, -0.87) *
Math.pow(age, -0.95) *
(sex === "female" ? 0.82 : 1);

/* Output */
document.getElementById("renalOutput").innerHTML =
"<b>CKD-EPI 2021:</b> " + egfr.toFixed(1) + " mL/min/1.73m²<br>" +
"<b>MDRD:</b> " + egfr_mdrd.toFixed(1) + "<br>" +
"<b>Cockcroft–Gault:</b> " + crcl.toFixed(1) + "<br>" +
"<b>BIS-1:</b> " + egfr_bis.toFixed(1);

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
label:'eGFR Comparison',
data:[egfr, egfr_mdrd, crcl, egfr_bis],
backgroundColor:['#38bdf8','#84cc16','#facc15','#f97316']
}]
},
options:{responsive:true}
});

}
