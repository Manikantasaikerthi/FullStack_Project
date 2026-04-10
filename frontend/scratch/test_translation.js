async function testTranslation() {
  const cases = [
    { text: "यह बहुत सुंदर है", from: "hi", to: "en" }, // Hindi
    { text: "చాలా బాగుంది", from: "te", to: "en" }, // Telugu
    { text: "हे खूप सुंदर आहे", from: "mr", to: "en" } // Marathi
  ];
  
  for (const c of cases) {
    console.log(`--- Testing: ${c.text} (${c.from}) ---`);
    
    // Google Translate (gtx)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${c.from}&tl=${c.to}&dt=t&q=${encodeURIComponent(c.text)}`;
    const gRes = await fetch(googleUrl);
    const gData = await gRes.json();
    console.log('Google Result:', gData[0][0][0]);

    // MyMemory
    const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(c.text)}&langpair=${c.from}|${c.to}`;
    const mRes = await fetch(myMemoryUrl);
    const mData = await mRes.json();
    console.log('MyMemory Result:', mData.responseData.translatedText);
  }
}

testTranslation();
