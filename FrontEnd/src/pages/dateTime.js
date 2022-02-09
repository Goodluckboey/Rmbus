// >>>> Time And Date Functions
let today = new Date();
let month = today.getMonth() + 1;
const monthList = [
  "january",
  "febuary",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  " november",
  "december",
];
const monthFunction = () => {
  for (let i = 1; i < monthList.length; i++) {
    if (i === month) {
      month = monthList[i];
    }
  }
};
monthFunction();
export let todayDate =
  "day " + today.getDate() + " of " + month + ", " + today.getFullYear();
export let hours = today.getHours();
let timeDetermine = "AM";
export let minutes = today.getMinutes();
const rightTime = () => {
  if (hours > 12) {
    hours -= 12;
    timeDetermine = "PM";
  }
};
rightTime();
export let todayTime = `The time now is ${hours} ${minutes} ${timeDetermine}`;

// import {todayDate, hours, minutes, todayTime} from "./dateTime"
