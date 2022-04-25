import { useState } from "react";
import { ethers } from 'ethers';
import './App.css';
import Greeter from './arifacts/contracts/Greeter.sol/Greeter.json'

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"


function App() {

  //store greeting in local state
  const [greeting, setGreetingValue] = useState()

  //requets access to user's Metamask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  //calll smart contract & read greeting
  async function fetchGreeting() {
    if (typeof window.ethereum != 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
        setGreetingValue(data)
      } catch (err) {
        console.log('error : ', err)
      }
    }
  }

  async function setGreeting() {
    if (!Greeter) return
    if (typeof window.ethereum != 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set Greeting" />
      </header>
    </div>
  );
}

export default App;
