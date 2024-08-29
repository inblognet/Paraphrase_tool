
function showLoader() {
    document.getElementById('loader').style.display = 'block';
  }
  
  function hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }
  
  function checkWordCount() {
    const textarea = document.getElementById('inputText');
    const wordCount = textarea.value.split(/\s+/).length;
    const warning = document.getElementById('wordCountWarning');
    if (wordCount > 500) {
      warning.style.display = 'block';
    } else {
      warning.style.display = 'none';
    }
  }
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function copyText(text) {
    navigator.clipboard.writeText(text);
    alert('Text has been copied!');
  }
  
  function countWords(text) {
    return text.split(/\s+/).filter(word => word.trim() !== '').length;
  }
  
  function paraphrase() {
    const inputText = document.getElementById('inputText').value;
    const sentences = inputText.split('.').filter(sentence => sentence.trim() !== '');
    if (sentences.length > 3) {
      alert("Please input up to three sentences only.");
      return;
    }
    const warning = document.getElementById('wordCountWarning');
    if (countWords(inputText) > 500) {
      warning.style.display = 'block';
      return;
    }
    showLoader();
    fetch("https://api.ai21.com/studio/v1/paraphrase", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR API KEY PASTE HERE",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "text": inputText
      })
    })
    .then(response => response.json())
    .then(data => {
      const suggestions = data.suggestions;
      const suggestionsList = document.getElementById('suggestions');
      suggestionsList.innerHTML = '';
      suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        listItem.textContent = suggestion.text;
        
        const wordCount = document.createElement('span');
        wordCount.textContent = `Word Count: ${countWords(suggestion.text)}`;
        wordCount.className = 'word-count';
        listItem.appendChild(wordCount);
  
        const colorBox = document.createElement('span');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = getRandomColor();
        listItem.insertBefore(colorBox, listItem.firstChild);
        
        // Add copy button
        const copyButton = document.createElement('span');
        copyButton.textContent = '📋';
        copyButton.className = 'copy-button';
        copyButton.onclick = () => copyText(suggestion.text);
        listItem.appendChild(copyButton);
        
        suggestionsList.appendChild(listItem);
      });
      hideLoader();
    })
    .catch(error => {
      console.error('Error:', error);
      hideLoader();
    });
  }
