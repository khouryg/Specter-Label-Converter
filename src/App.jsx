import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  // write a function that takes in a json file and console logs the contents of the file

  const readFile = (file) => {
    const input = document.getElementById(file);
    const reader = new FileReader();
    reader.readAsText(input.files[0]);
    reader.onload = async function () {
      const text = reader.result;
      const unformattedJson = JSON.parse(text);
      const formattedJson = formatter(unformattedJson);
      createAndSaveFile(formattedJson);
    };
  }

  const createAndSaveFile = (content) => {
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

  const formatter = (json) => {
    let formattedJson = '';
    if (json.labels) {
      Object.keys(json.labels).forEach((key) => {
        formattedJson += json.labels[key].map((label) => {
          return JSON.stringify({
            "type": 'tx',
            "ref": key,
            "label": label
          }) + '\n';
        })
      });
    }
    console.log(formattedJson.replaceAll(/,/g, ''));
    return formattedJson.replaceAll(/,/g, '');
  }

  return (
    <>
      <h1>Sparrow Label Converter</h1>
      <input type='file' id='fileInput' accept='.json'></input>
      <div id='convertButton--div'>
        <button id='convertButton' onClick={() => { readFile('fileInput') }} >Convert</button>
      </div>
    </>
  )
}

export default App
