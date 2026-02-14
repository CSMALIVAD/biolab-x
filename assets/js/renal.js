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
let chloride = parseFloat(document.getElementById("chloride").value);
let albumin = parseFloat(document.getElementById("albumin").value);

let urineNa = parseFloat(document.getElementById("urineNa").value);
let urineCr = parseFloat(document.getElementById("urineCr").value);
let urineUrea = parseFloat(document.getElementById("urineUrea").value);

if(isNaN(age) || isNaN(creatinine)){
alert("Age and Creatinine required");
return;
}

/* Convert µmol/L to mg/dL */
if(unit === "umol"){
creatinine = creatinine / 88.4;
}

/* ========================= */
/* eGFR EQUATIONS */
/* ========================= */

let k = (sex === "female") ? 0.7 : 0.9;
let alpha = (sex === "female") ? -0.241 : -0.302;
let sexFactor = (sex === "female") ? 1.012 : 1;

let egfr_ckd =
142 *
Math.pow(Math.min(creatinine/k,1), alpha) *
Math.pow(Math.max(creatinine/k,1), -1.200) *
Math.pow(0.9938, age) *
sexFactor;

let egfr_mdrd =
175 *
Math.pow(creatinine, -1.154) *
Math.pow(age, -0.203) *
(sex === "female" ? 0.742 : 1);

let crcl = null;
if(!isNaN(weight)){
crcl = ((140 - age) * weight) / (72 * creatinine);
if(sex === "female"){ crcl *= 0.85; }
}

let egfr_bis =
3736 *
Math.pow(creatinine, -0.87) *
Math.pow(age, -0.95) *
(sex === "female" ? 0.82 : 1);

/* ========================= */
/* RENAL INDICES */
/* ========================= */

let bunCrRatio = (!isNaN(bun)) ? (bun / creatinine) : null;

let osmolality = (!isNaN(sodium) && !isNaN(glucose) && !isNaN(bun))
? (2 * sodium + glucose/18 + bun/2.8)
: null;

let correctedNa = (!isNaN(glucose) && !isNaN(sodium))
? sodium + 1.6
