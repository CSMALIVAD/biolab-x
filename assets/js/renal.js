function analyzeRenal(){

let age = parseFloat(document.getElementById("age").value);
let creatinine = parseFloat(document.getElementById("creatinine").value);

if(isNaN(age) || isNaN(creatinine)){
alert("Enter age and creatinine");
return;
}

/* Simple CKD-EPI core test calculation */
let egfr = 141 * Math.pow(creatinine, -1.2) * Math.pow(0.993, age);

document.getElementById("renalOutput").innerHTML =
"Test eGFR Value: " + egfr.toFixed(1);

}
