const fs = require("fs");

// Step 1: Read the JSON file and convert it to JS object
let data = JSON.parse(fs.readFileSync("balancesDataMap.json", "utf8"));


if(data["abhi"] < 100){
  // Step 2: Update the value for key "abhi"
  data["abhi"] += 25000;
}else{
    data["abhi"] += 1000;
}

if(data["bob"] < 1000){
    data["bob"] += 5;
}


console.log(data["abhi"]);
// Step 4: Save the updated object back to JSON
fs.writeFileSync("data.json", JSON.stringify(data,null,2));

console.log("Done. JSON updated!");
