let chartInstance = null;

function getColor(value, low, high){
if(value < low) return "#ef4444";     // red
if(value > high) return "#f59e0b";    // orange
return "#22c55e";                     // green
}

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

/* Primary Disorder */
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

/* Reference Ranges (Tietz Adult) */
let phColor = getColor(ph,7.35,7.45);
let pco2Color = getColor(pco2,35,45);
let hco3Color = getColor(hco3,22,26);
let agColor = getColor(ag,8,12);

/* Output */
let outputHTML = `
<div style="font-size:20px;color:#38bdf8;font-weight:bold;margin-bottom:10px;">
${primary}
</div>

<p>pH: <span style="color:${phColor};font-weight:bold;">${ph}</span> (Ref: 7.35–7.45)</p>
<p>pCO₂: <span style="color:${pco2Color};font-weight:bold;">${pco2}</span> (Ref: 35–45)</p>
<p>HCO₃: <span style="color:${hco3Color};font-weight:bold;">${hco3}</span> (Ref: 22–26)</p>
<p>Anion Gap: <span style="color:${agColor};font-weight:bold;">${ag.toFixed(2)}</span> (Ref: 8–12)</p>
<p>Corrected AG: ${correctedAG.toFixed(2)}</p>
`;

document.getElementById("output").innerHTML = outputHTML;

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
borderColor:'#38bdf8',
borderWidth:2
}]
},
options:{
plugins:{legend:{labels:{color:'white'}}}
}
});

}
