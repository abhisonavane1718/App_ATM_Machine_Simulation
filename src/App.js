import { useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [cardnumber, setcardnumber] = useState("");
  const [page, setPage] = useState(1);
  const [d, setd] = useState(0);
  const [s, sets] = useState(0);
  const cardref = useRef();
  const pinref = useRef();
  const depositref = useRef();
  const dref = useRef();
  

  const initialDataMap = {
    "1111222233334444": 1234,
    "1111111111111111": 1111,
    "7777777777777777": 7777
  };
  let c1 = 0;

  function cardlogin () {
    if(cardref.current.value.length === 0){
      alert("Please enter your Card Number");
      return;
    }
    c1++;
    if(c1 > 3){
      document.getElementById("message").innerText = "";
      document.getElementById("error").innerText = "";
      document.getElementById("error2").innerText = "Access Denied since you have Entered wrong Card Number >= 3 times.";
      cardref.current.value = "";
      return;
    }

      let i = 0, cn = "";
      
      for (i = 0; i < 3; i++) {
        cn = cardref.current.value;
          if (!(cn in initialDataMap)) {
              if (c1 >= 3) {
                document.getElementById("message").innerText = "";
                document.getElementById("error").innerText = "";
                document.getElementById("error2").innerText = "Access Denied since you have Entered wrong Card Number >= 3 times.";
                cardref.current.value = "";
                return;
              }
              document.getElementById("message").innerText = "";
              document.getElementById("error").innerText = "Invalid Card number. Try again.";
              cardref.current.value = "";
              return;
          } else {
              break;
          }
      }

      if (c1 < 4) {
        document.getElementById("error").innerText = "";
        document.getElementById("error2").innerText = "";
        document.getElementById("message").innerText = "Card Number Verified. Please enter your PIN.";
      }

      setcardnumber(cn);
      sets(1);
  }

  let c2 = 0;
  function pinlogin () {
    if(s === 0){
      alert("Please enter your Card Number first and verify it.");
      pinref.current.value = ""
      return;
    }
    if(pinref.current.value.length === 0){
      alert("Please enter your pin Number");
      return;
    }
    // let cardnumber2 = cardlogin(); 
      c2++;
      let j = 0;
      let PIN = 0;

      for (j = 0; j < 3; j++) {
          PIN = Number(pinref.current.value);
          if (initialDataMap[cardnumber] === PIN && c2 < 4) {
              document.getElementById("m2").innerText = "PIN Verified. You have successfully logged in.";
              document.getElementById("error3").innerText = "";
              document.getElementById("error4").innerText = "";
              setd(1);
              return;
          } else {
              if (c2 >= 3) {
                document.getElementById("m2").innerText = "";
                  document.getElementById("error3").innerText = "";
                  document.getElementById("error4").innerText = "Access Denied since you have Entered wrong PIN >= 3 times.";
                  pinref.current.value = "";
                  return;
              }
              
              document.getElementById("m2").innerText = "";
              document.getElementById("error4").innerText = "";
              document.getElementById("error3").innerText = "Invalid PIN entered. Try again.";
              pinref.current.value = "";
              return;
          }
      }

      return;
  }

  async function balancecheck() {
    const response = await fetch(`http://localhost:5000/balance/${cardnumber}`);
    const data = await response.json();
    
    document.getElementById("balance").innerText =
      `Your account balance is: INR ${data.balance}`;
  }

  async function depositmoney() {
      let amount = Number(depositref.current.value);
      if(!amount || amount <= 0){
        alert("Please enter a valid amount to deposit.");
        depositref.current.value = "";
        return;
      }
      const response = await fetch("http://localhost:5000/deposit", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ cardnumber, amount })
      });
      
      let b = await response.json();
      
      document.getElementById("depo").innerText = `INR ${amount} has been successfully deposited into your account. Your current account balance is: INR ${b.balance}`;

      depositref.current.value = ""; // Clear the input field after successful deposit

      return; // STOP HERE - don't do anything else
        
  }
  
  async function withdrawMoney(){    
    try {
      let amount = Number(dref.current.value);
      if(!amount || amount <= 0){
        alert("Please enter a valid amount to withdraw.");
        dref.current.value = "";
        return;
      }
      
        const response = await fetch("http://localhost:5000/withdraw", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ cardnumber, amount })
        });
        
        let b = await response.json();
        if(b.balance === null){
          alert("Insufficient Balance. Cannot withdraw the requested amount.");
          dref.current.value = "";
          return;
        }
        
        document.getElementById("withdraw").innerText = `INR ${amount} has been successfully withdrawn from your account. Your current account balance is: INR ${b.balance}`;
        
        dref.current.value = ""; // Clear the input field after successful deposit
        return; // STOP HERE - don't do anything else
        
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred: " + error.message);
    }
  }

  async function getTransactionHistory() {
    const response = await fetch(`http://localhost:5000/transaction-history/${cardnumber}`);
    const data = await response.json();

    let historyText = "";
    
    for(let i = data.history.length - 1; i >= 0; i--){
      historyText += `${data.history.length - i}. ${data.history[i]}\n`;
    }

    document.getElementById("history").innerText = historyText;
  }

  return (    
    <div className='container  my-5'>
      {page === 1 && (
        <div>
            <h2 className="container text-center my-2">
                Welcome to ATM Machine
            </h2>

          <div className="container mx-1 my-5">
            <label className=''>Enter your 16 digit Debit / ATM Card number:</label>
            <input id="input" className='mx-3' type="text" maxLength="16" placeholder="Card Number" ref={cardref} />
            <button id="bob" className='mx-3 btn btn-outline-dark' onClick={cardlogin}> Verify Card Number </button><br />

            <p id="error" style={{color:'red'}}></p>
            <p id="error2" style={{color:'red'}}></p>
            <p id="message" style={{color:'green'}}></p>
          </div>

          <div className="container mx-1 my-5">
            <label>Enter your 4 digit PIN:</label>
            <input id="input" className='mx-3' type="password" maxLength={4} placeholder="PIN" ref={pinref}/>
            <button id="bob" className='mx-3 btn btn-outline-dark' onClick={pinlogin}> Verify PIN </button>

            <p id="error3" style={{color:'red'}}></p>
            <p id="error4" style={{color:'red'}}></p>
            <p id="m2" style={{color:'green'}}></p>

            {d === 1 &&(
              <div>
                  <button id="proceed" className="btn btn-outline-dark" onClick={() => setPage(2)}
                  >Proceed</button>
              </div>
            )}
            
          </div>

        </div>
        )
      }


      {page === 2 && (
        <div>
          <h2 className="container text-center my-2">
              ATM Operations.
          </h2><br />

          <div className="container">
            <p>User Card Number: {cardnumber}</p>
            <ol>1. Check Account Balance. <button id="bob" className="btn btn-outline-dark mx-3" 
              onClick={() => {setPage(3);balancecheck()}}> Check </button></ol>
            <ol>2. Deposit Money. <button id="bob" className="btn btn-outline-dark mx-5" onClick={() => setPage(4)}  style={{
              position: 'absolute',
              top: '202px',
              left: '340px',
            }}> Proceed </button></ol>
            <ol>3. Withdraw Money. <button id="bob" className="btn btn-outline-dark mx-5" onClick={() => setPage(5)} style={{
              position: 'absolute',
              top: '245px',
              left: '340px',
            }}> Proceed </button></ol>
            <ol>4. View Transaction History. <button id="bob" className="btn btn-outline-dark" onClick={() => {setPage(6); getTransactionHistory()}} 
              style={{
                position: 'absolute',
                top: '287px',
                left: '387px',
            }}> View </button></ol>
          </div>
          <div className="container">
            <button id="bob" className="btn btn-outline-dark" onClick={() => {
              if(window.confirm("Press OK to confirm logout.")){
                window.location.reload();
            }}} style={{
            position: 'absolute',
            bottom: '20px',
            right: '50px',
            backgroundColor: 'red',
            color: 'white',
      }}> LogOut </button>
          </div>
        </div>
        )
      }

      {page === 3 && (
        <div>
          <h2 className="container text-center my-2">
            Account Balance.
          </h2><br />
          <div>
            <h3 id="balance"> </h3><br />
            <button id="bob" className="btn btn-outline-dark" onClick={() => setPage(2)} style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'black',
            color: 'white',
      }}> Back to Operations </button>
          </div>
        </div>
        )
      }

      {page === 4 && (
        <div>
            <h2 className="container text-center my-2">
              Deposit Money.
            </h2><br />

          <div>
            <label className=''>Enter the amount of money you want to deposit into your account: </label>
            <input id="input" className='mx-3' type="text" maxLength="100" placeholder="Enter amount" ref={depositref} />
            
            <button id="bob"
              type="button"
              className="mx-3 btn btn-outline-dark"
              onClick={depositmoney}
              onMouseOver={(e) => (e.target.style.backgroundColor = "green")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "")}
            >
              Deposit Money
            </button>

            
            <p id="depo" style={{color:'green'}}></p>
            <button id="bob" className="btn btn-outline-dark" onClick={() => setPage(2)} 
              style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'black',
            color: 'white',
      }}> Back to Operations </button>

          </div>
          
        </div>
        )
      }

      {page === 5 && (
        <div>
          <h2 className="container text-center my-2">
            Withdraw Money.
          </h2><br />
          <div>
            <label className=''>Enter the amount of money you want to withdraw from your account: </label>
            <input id="input" className="mx-3" type="number" placeholder="Enter amount" ref={dref}/>
            <button id="wd" className="btn btn-outline-dark mx-3" type="button" onClick={withdrawMoney}> Withdraw Money </button>
            <p className="my-4" id="withdraw" style={{color:'green'}}></p>

            <button id="bob" className="btn btn-outline-dark" onClick={() => setPage(2)} 
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'black',
            color: 'white',
            }}> Back to Operations </button>
          </div>
        </div>
        )
      }

      {page === 6 && (
        <div>
          <h2 className="container text-center my-2">
            Transaction History.
          </h2><br />
          <div>
            <p>The Transactions arranged by most recent on top:</p>
            <pre id="history" style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}></pre>
          </div>

          <button id="bob" className="btn btn-outline-dark" onClick={() => setPage(2)} style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            backgroundColor: 'black',
            color: 'white',
      }}> Back to Operations </button>


        </div>
        )
      }
    </div>  
  )
}
