import { useState } from "react";

const [state, setstate] = useState("");

const mystate = [
  { name: "car", colour: "blue", numOfVehicles: 5, amountOfFuel: 5000 },
  { name: "truck", colour: "red", numOfVehicles: 1, amountOfFuel: 10000 },
  { name: "bike", colour: "green", numOfVehicles: 3, amontOfFuel: 2000 },
];

let totalFuel = 0;

for (const element of mystate) {
  totalFuel = totalFuel + element.amontOfFuel * element.numOfVehicles;
  console.log(totalFuel);
}

// VV this does exactly the same thing as the for loop above:

mystate.map((element) => {
  totalFuel = totalFuel + element.amontOfFuel * element.numOfVehicles;
  console.log(totalFuel);
});

/*

App.js
    >> props.selectedItemList
        yourComponent

*/
