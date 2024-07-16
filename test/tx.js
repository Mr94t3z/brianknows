async function performTransaction() {
    const url = "https://api.brianknows.org/api/v0/agent/transaction";
    const apiKey = "API_KEY"; // Replace with your actual API key
  
    const data = {
      prompt: "I want to swap 1 DEGEN for ETH on base",
      address: "0x9319b31838bba444CCeAeD025153a48AD6377471"
    };
  
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-brian-api-key": apiKey
      },
      body: JSON.stringify(data)
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result);
      console.log(result.data);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  
  performTransaction();
  