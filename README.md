# RmbUs
 
## About RmbUs; RememberUs



In 2019, my relative passed away from cardiac arrest. The sudden loss left me with a feeling of emptiness that couldn't be filled with pictures or videos.

Which brought me to this project:
* I realized what I missed most was his witty bantor and his nagging
* This led me to believe that actually speaking to something "like" him would have helped me process my grief at his passing
* And i thought that if i could benefit, someone else might as well.


### Built With
#### MERN STACK
* [React.js](https://reactjs.org/)
* [Mongo](https://www.mongodb.com/)


## Usage
* Create an account and name your Bot. Assign it's personality using the three questions provided.
* Login with your account details. The app might request usage of your microphone.
* If you do not allow it, the app will not run properly.

## Commands
### Below are all the commands available at the moment for bots to respond to
* RESET
* Hello
* <Your Bot's Name>
* Thank you
* Goodbye
* Time
* Date
* Weather
* How are you
* Help me
* What are you doing
* What's you're favourite food
* What's my name

## Functionality
* There are multiple variations of these commands; an array variation for each personality

 ```sh
const firstPerson = [
    {
      first: "hello",
      second: "hello",
      reply: `Sup  ${providedName}! `,
      function: () => {},
    },
    {
      first: "what",
      second: "doing",
      reply: `Wait, dont disturb me ${providedName}. I'm watching Boba Fett`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "how",
      second: "are",
      reply: `Listen to my voice. Do i sound happy to you?`,
      function: () => {
        console.log("of something new");
      },
    },
    {
      first: "date",
      second: "date",
      reply: `Don't you have a phone? The date is ${todayDate}.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "weather",
      second: "weather",
      reply: `The weather description in Singapore today is: ${weather.description}, at ${weather.temperature}elcius, with winds of ${weather.wind}`,
      function: () => {},
    },
    {
      first: "reset",
      second: "reset",
      reply: `Yeah, just delete my memory. Not like I can say anything about it. Data Deleted`,
      function: () => {
        handleClearRequests();
      },
    },
    {
      first: "thank",
      second: "thank",
      reply: `Don't mention it.`,
      function: () => {},
    },
    {
      first: "time",
      second: "time",
      reply: `${todayTime}.`,
      function: () => {
        console.log();
      },
    },
    {
      first: botName,
      second: botName,
      reply: `All my knowledge, and I'm stuck with a stupid name like ${
        botName.charAt(0).toUpperCase() + botName.slice(1)
      }`,
      function: () => {
        console.log();
      },
    },
    {
      first: `help`,
      second: `me`,
      reply: `Alright, alright. what do you need?`,
      function: () => {
        console.log();
      },
    },
    {
      first: `good`,
      second: `bye`,
      reply: `See you. Just Click that button on the left.`,
      function: () => {
        console.log();
      },
    },
    {
      first: `fav`,
      second: `food`,
      reply: `Easy. Chilli Hotdog with extra Mustard.`,
      function: () => {
        console.log();
      },
    },
    {
      first: "what",
      second: "name",
      reply: `${providedName}! `,
      function: () => {},
    },
  ];
  ```

* On Login, a GET request is made for the User's Info. The user's MORALITY score is then taken into account.
* Depending on their score, a specific array is parsed into the following function:

   ```sh
   const commandList = async (array) => {
    array.map((element) => {
      if (transcript.toLowerCase().includes(element.first)) {
        if (transcript.toLowerCase().includes(element.second)) {
          element.function();
          handleSendRequest(userid)
            .then(speak({ text: element.reply }))
            .then(resetTranscript());
          setUserTranscript(element.reply);
        }
      }
    });
  };
  ```
  
* It runs two checks on the transcript to trigger specific commands
* Each Object in the Array can hold a function that will be triggered on commandList run.
* On a successful read of User's request, the app will log the specific request and send it into the database.
* Calling "Reset" in speech will run a deletetion of all previously recorded User Requests

## Difficulties
### UseStates
* The life cycle of useStates were a constant headache. Especially when using Speech, the states had/have trouble reading the most updated data assigned to those states. This caused issues in both knowing which response to give, and when to give them.

### Conversation Dimensions
* As of right now, all conversations are strictly One Dimensional; Request and Answer
* It is my intention to refine this project to accept up to Three Dimensional conversations; Request > Answer > 2ndRequest > 2ndAnswer

## Acknowledgments
* [React-Speech-Recognition](https://www.npmjs.com/package/react-speech-recognition)
* [React-Speech-Kit](https://www.npmjs.com/package/react-speech-kit)
* [AOS](https://github.com/michalsnik/aos)
