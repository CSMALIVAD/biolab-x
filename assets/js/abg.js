let chartInstance = null;

function analyzeABG(){

let ph = parseFloat(document.getElementById("ph").value);
let pco2 = parseFloat(document.getElementById("pco2").value);
let hco3 = parseFloat(document.getElementById("hco3").value);
let na = parseFloat(document.getElementById("na").value);
let cl = parseFloat(document.getElementById("cl").value);
let albumin = parseFloat(document.getElementById("albumin").value);

if(isNaN(ph) || isNaN(pco2) || isNaN(hco3) || isNaN(na) || isNaN(cl)){
alert("Please enter all required values.");
return;
}

if(isNaN(albumin)){
albumin = 4;
}

/* Calculations */
let ag = na - (cl + hco3);
let correctedAG = ag + 2.5 * (4 - albumin);

/* Determine Primary Disorder */
let primary = "Mixed or Compensated";

if(ph < 7.35 && hco3 < 22){
primary = "Metabolic Acidosis";
}
else if(ph < 7.35 && pco2 > 45){
primary = "Respiratory Acidosis";
}
else if(ph > 7.45 && hco3 > 26){
primary = "Metabolic Alkalosis";
}
else if(ph > 7.45 && pco2 < 35){
primary = "Respiratory Alkalosis";
}

/* Show Output */
document.getElementById("output").innerHTML =
"<b>Primary Disorder:</b> " + primary + "<br><br>" +
"Anion Gap: " + ag.toFixed(2) + "<br>" +
"Corrected AG: " + correctedAG.toFixed(2);

/* Chart */
if(chartInstance !== null){
chartInstance.destroy();
}

let ctx = document.getElementById("chart").getContext("2d");

chartInstance = new Chart(ctx,{
type:'radar',
data:{
labels:['pH','pCO₂','HCO₃'],
datasets:[{
label:'ABG Parameters',
data:[ph,pco2,hco3],
backgroundColor:'rgba(56,189,248,0.3)',
borderColor:'#38bdf8'
}]
}
});

}

