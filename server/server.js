const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(express.json()); 
app.use(cors());

app.post("/deposit", (req, res) => {
    const { cardnumber, amount } = req.body;
    let data = JSON.parse(fs.readFileSync("balancesDataMap.json", "utf8"));

    data[cardnumber] += Number(amount);

    fs.writeFileSync("balancesDataMap.json", JSON.stringify(data, null, 2));

    res.json({
        balance: data[cardnumber]
    });

    let transactionDataMap = JSON.parse(fs.readFileSync("transhisDataMap.json", "utf8"));
    let arr = transactionDataMap[cardnumber];
    let str = "Deposited INR: " + amount + " | New Balance INR: " + data[cardnumber] + " | Date: " + new Date().toLocaleString();
    arr.push(str);
    transactionDataMap[cardnumber] = arr;
    fs.writeFileSync("transhisDataMap.json", JSON.stringify(transactionDataMap, null, 2));
});

app.post("/withdraw", (req, res) => {
    const { cardnumber, amount } = req.body;
    let data = JSON.parse(fs.readFileSync("balancesDataMap.json", "utf8"));

    if(data[cardnumber] >= amount) {
        data[cardnumber] -= Number(amount);
        fs.writeFileSync("balancesDataMap.json", JSON.stringify(data, null, 2));

        res.json({
            balance: data[cardnumber]
        });

        let transactionDataMap = JSON.parse(fs.readFileSync("transhisDataMap.json", "utf8"));
        let arr = transactionDataMap[cardnumber];
        let str = "Withdrew INR: " + amount + " | New Balance INR: " + data[cardnumber] + " | Date: " + new Date().toLocaleString();
        arr.push(str);
        transactionDataMap[cardnumber] = arr;
        fs.writeFileSync("transhisDataMap.json", JSON.stringify(transactionDataMap, null, 2));
    }
    else{
        res.json({
            balance: null
        });
    } 
});

app.get("/balance/:cardnumber", (req, res) => {
    const { cardnumber } = req.params;
    let data = JSON.parse(fs.readFileSync("balancesDataMap.json", "utf8"));
    
    res.json({
        balance: data[cardnumber]
    });
});

app.get("/transaction-history/:cardnumber", (req, res) => {
    const { cardnumber } = req.params;
    let transactionDataMap = JSON.parse(fs.readFileSync("transhisDataMap.json", "utf8"));
    let arr = transactionDataMap[cardnumber];
    res.json({
        history: arr
    });
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
