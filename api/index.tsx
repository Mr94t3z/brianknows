import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import dotenv from 'dotenv';

// Uncomment this packages to tested on local server
import { devtools } from 'frog/dev';
import { serveStatic } from 'frog/serve-static';

// Load environment variables from .env file
dotenv.config();

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api/frame',
  title: 'Brian Transaction AI'
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
})

app.frame('/', (c) => {
  return c.res({
    image: 'https://media.giphy.com/media/Tz30dcgKE3GCTYpxol/giphy.gif',
    intents: [
      <TextInput placeholder="Type like `Swap 1 DEGEN for ETH`" />,
      <Button action='/loading'>Ask Brian 🤖</Button>,
    ],
  })
})


app.frame('/loading', (c) => {
  const { inputText } = c
  return c.res({
    image: 'https://media.giphy.com/media/Tz30dcgKE3GCTYpxol/giphy.gif',
    intents: [
      <Button action={`/result/${inputText}`}>Processed</Button>,
    ],
  })
})


app.frame('/result/:inputText', async (c) => {
  const { inputText } = c.req.param();
  const prompt = inputText;

  console.log('prompt:', prompt)


  console.log('prompt:', prompt);

  // Define API credentials and endpoint
  const apiKey = process.env.BRIAN_API_KEY || '';
  const apiEndpoint = 'https://api.brianknows.org/api/v0/agent/transaction';

  const apiData = {
    prompt: prompt,
    address: '0xc698865c38eC12b475AA55764d447566dd54c758'
  };

  try {
    // Make a POST request to the Brianknows API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brian-api-key': apiKey
      },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response from the API
    const apiResponse = await response.json();
    // console.log('BrianKnows API Response:', apiResponse);

    // Extract necessary data from the API response
    const dataObject = apiResponse.result[0].data;
    // console.log('All Data:', dataObject);

    const description = dataObject.description;

    console.log('Description:', description);

  } catch (error) {
    console.error('Error:', error);
  }
  return c.res({
    image: 'https://media.giphy.com/media/Tz30dcgKE3GCTYpxol/giphy.gif',
    intents: [
      <Button.Transaction target={`/confirm/${prompt}`}>Confirm</Button.Transaction>,
    ],
  })
})


app.transaction('/confirm/:prompt', async (c) => {
  const { address } = c;
  const { prompt } = c.req.param();

  console.log('prompt:', prompt);

  // Define API credentials and endpoint
  const apiKey = process.env.BRIAN_API_KEY || '';
  const apiEndpoint = 'https://api.brianknows.org/api/v0/agent/transaction';

  const apiData = {
    prompt: prompt,
    address: address,
  };

  // try {
    // Make a POST request to the Brianknows API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-brian-api-key': apiKey
      },
      body: JSON.stringify(apiData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response from the API
    const apiResponse = await response.json();
    // console.log('BrianKnows API Response:', apiResponse);

    // Extract necessary data from the API response
    const dataObject = apiResponse.result[0].data;
    // console.log('All Data:', dataObject);

    const chainId = dataObject.steps[0]?.chainId;
    const toAddress = dataObject.steps[0]?.to;
    const txData = dataObject.steps[0]?.data;
    const gasPrice = dataObject.steps[0]?.gasLimit;

    return c.send({
      chainId: `eip155:${chainId}` as any,
      to: toAddress as `0x${string}`,
      data: txData,
      gas: gasPrice,
    });
});


// Uncomment for local server testing
devtools(app, { serveStatic });

export const GET = handle(app)
export const POST = handle(app)
