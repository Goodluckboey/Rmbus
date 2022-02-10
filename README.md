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

## Functionality
* There are multiple variations of these commands; an array variation for each personality
* On Login, the user's MORALITY score is taken into account
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
