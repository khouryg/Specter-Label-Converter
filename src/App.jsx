import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const convert = async () => {
    let result = '';
    const csvContent = await readFile('csvFile');
    const walletContent = await readFile('walletFile');
    const formattedCsvData = formatCsvFile(csvContent);
    const formattedWalletData = formatWalletFile(walletContent);
    const combinedData = formattedCsvData + '\n' + formattedWalletData;
    createAndSaveFile(combinedData);
  }

  const readFile = (id) => {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id).files.length === 0) {
        resolve('');
      } else {
        const input = document.getElementById(id);
        const reader = new FileReader();
        reader.readAsText(input.files[0]);
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
      }
    })
  }

  const formatCsvFile = (file) => {
    let output = '';
    const arr = file.trimEnd().split('\n');
    const dataArr = arr.slice(1);
    const resultArr = [];
    dataArr.forEach((line) => {
      resultArr.push(line.split(','));
    })
    resultArr.forEach((line) => {
      const obj = {};
      obj['type'] = 'tx';
      obj['ref'] = line[6];
      obj['label'] = line[1];
      output += JSON.stringify(obj) + '\n';
    });
    return output.trimEnd();
  }

  const formatWalletFile = (file) => {
    let formattedJson = '';
    file = JSON.parse(file);
    // add ref for addresses and labels
    if (file.labels) {
      Object.keys(file.labels).forEach((label) => {
        file.labels[label].forEach((ref) => {
          formattedJson += JSON.stringify({
            "type": 'addr',
            "ref": ref,
            "label": label
          }) + '\n';
        })
      });
    }
    if (file.keys) {
      file.keys.forEach((key) => {
        formattedJson += JSON.stringify({
          "type": 'xpub',
          "ref": key.original,
          "label": key.fingerprint
        }) + '\n';
      });
    }
    return formattedJson.trimEnd();
  }

  const createAndSaveFile = (content) => {
    if (!content) return;
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'labels.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  return (
    <>
      <h1>Sparrow Label Converter</h1>
      <h3>Sparrow Wallet Export File</h3>
      <input type='file' id='walletFile' accept='.json'></input>
      <h3>Sparrow Transactions CSV</h3>
      <input type='file' id="csvFile" accept='.csv'></input>
      <div id='convertButton--div'>
        <button id='convertJsonButton' onClick={() => { convert() }} >Convert</button>
      </div>
    </>
  )
}

export default App
