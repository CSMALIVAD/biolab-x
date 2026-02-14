function analyzeRenal(){

let age = parseFloat(document.getElementById("age").value);
let weight = parseFloat(document.getElementById("weight").value);
let sex = document.getElementById("sex").value;

let creatinine = parseFloat(document.getElementById("creatinine").value);
let creatUnit = document.getElementById("creatUnit").value;

let bun = parseFloat(document.getElementById("bun").value);
let sodium = parseFloat(document.getElementById("sodium").value);
let glucose = parseFloat(document.getElementById("glucose").value);
let albumin = parseFloat(document.getElementById("albumin").value);

let urineNa = parseFloat(document.getElementById("urineNa").value);
let urineCr = parseFloat(document.getElementById("urineCr").value);
let urineUrea = parseFloat(document.getElementById("urineUrea").value);

if(isNaN(age) || isNaN(creatinine)){
alert("Age and Creatinine required");
return;
}

/* Unit Conversion */
if(creatUnit === "umol"){
creatinine = creatinine / 88.4;
}

/* CKD-EPI 2021 */
let k = (sex === "female") ? 0.7 : 0.9;
let alpha = (sex === "female") ? -0.241 : -0.302;
let sexFactor = (sex === "female") ? 1.012 : 1;

let egfr_ckd_epi =
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
let crcl =
((140 - age) * weight) / (72 * creatinine);
if(sex === "female"){ crcl *= 0.85; }

/* BIS-1 (Elderly) */
let egfr_bis =
3736 *
Math.pow(creatinine, -0.87) *
Math.pow(age, -0.95) *
(sex === "female" ? 0.82 : 1);

/* BUN/Creatinine Ratio */
let bunCrRatio = !isNaN(bun) ? (bun / creatinine) : null;

/* Serum Osmolality */
let osmolality = (!isNaN(sodium) && !isNaN(glucose) && !isNaN(bun))
? (2 * sodium + glucose/18 + bun/2.8)
: null;

/* Corrected Sodium (Hyperglycemia) */
let correctedNa = (!isNaN(glucose) && !isNaN(sodium))
? sodium + 1.6 * ((glucose - 100)/100)
: null;

/* FENa */
let fena = (!isNaN(urineNa) && !isNaN(urineCr) && !isNaN(sodium))
? ((urineNa * creatinine) / (sodium * urineCr)) * 100
: null;

/* FEUrea */
let feu = (!isNaN(urineUrea) && !isNaN(urineCr) && !isNaN(bun))
? ((urineUrea * creatinine) / (bun * urineCr)) * 100
: null;

/* CKD Stage */
function ckdStage(gfr){
if(gfr >= 90) return "G1 (Normal)";
if(gfr >= 60) return "G2 (Mild)";
if(gfr >= 45) return "G3a";
if(gfr >= 30) return "G3b";
if(gfr >= 15) return "G4 (Severe)";
return "G5 (Kidney Failure)";
}

/* Output */
let output = `
<h3>eGFR Comparison</h3>
CKD-EPI 2021: ${egfr_ckd_epi.toFixed(1)} mL/min/1.73m² (${ckdStage(egfr_ckd_epi)})<br>
MDRD: ${egfr_mdrd.toFixed(1)} mL/min/1.73m²<br>
Cockcroft–Gault (CrCl): ${crcl.toFixed(1)} mL/min<br>
BIS-1: ${egfr_bis.toFixed(1)} mL/min/1.73m²<br>

<hr>

<h3>Renal Indices</h3>
BUN/Creatinine Ratio: ${bunCrRatio ? bunCrRatio.toFixed(1) : "N/A"}<br>
Serum Osmolality: ${osmolality ? osmolality.toFixed(1) + " mOsm/kg" : "N/A"}<br>
Corrected Sodium: ${correctedNa ? correctedNa.toFixed(1) : "N/A"}<br>
FENa: ${fena ? fena.toFixed(2) + "%" : "N/A"}<br>
FEUrea: ${feu ? feu.toFixed(2) + "%" : "N/A"}
`;

document.getElementById("renalOutput").innerHTML = output;

}
