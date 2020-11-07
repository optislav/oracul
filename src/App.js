/* eslint-disable no-undef */
import { Button, Input, Typography } from 'antd';
import robot from './robot.jpg';
import './App.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const recognitionRef = useRef(null);
  const textRef = useRef('');
  const [, forceUpdate] = useState({});
  const textAreaRef = useRef(null);

  useEffect(() => {
    const grammar = '#JSGF V1.0; grammar colors; public <color> = белый | розовый | черный | серый ;'
    const recognition = new webkitSpeechRecognition();
    const speechRecognitionList = new webkitSpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    //recognition.continuous = false;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = async function(event) {
      const newText = event.results[0][0].transcript;
      textRef.current = `${textRef.current}\n${newText}.`;
      forceUpdate({});
      const ta = textAreaRef.current.resizableTextArea.textArea;
      ta.scrollTop = ta.scrollHeight;
      const data = {
        prompt: `${newText}.`,
        length: newText.length,
      }
      const response = await fetch("https://pelevin.gpt.dobro.ai/generate/", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,ru;q=0.8",
          "content-type": "text/plain;charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site"
        },
        "referrerPolicy": "no-referrer",
        body: JSON.stringify(data),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });
      const json = await response.json();
      const reply = json.replies[1];
      textRef.current = `${textRef.current}\n${reply}`;
      forceUpdate({});
      ta.scrollTop = ta.scrollHeight;
      var uter = new SpeechSynthesisUtterance(reply);
      uter.lang = 'ru-RU';
      uter.pitch = 0.01;
      uter.rate = 2.3;
      speechSynthesis.speak(uter);
    };
  }, []);


  const handleClick = () => {
    recognitionRef.current.start();
    console.log('Ready to receive a color command.');
  };

  const handleChange = (...args) => {
    console.log(args);
  }

  return (
    <div className="App">
      <img className="robot-img" src={robot} alt=""/>
      <div className="right">
        <Typography.Title>Оракул отвечает</Typography.Title>
        <Input.TextArea
          ref={textAreaRef}
          className="textarea"
          value={textRef.current}
          onChange={handleChange}
          rows={15}
        />
        <div className="buttons">
          <Button size="large" type="primary" onClick={handleClick}>
            Сказать 
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
