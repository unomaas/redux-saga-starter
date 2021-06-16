// Generator functions can be paused, have weird syntax.
// Yield = return, but yield can be used multiple times.

function* myFirstGenerator() {
  yield 10;
  let name= 'ryan'
  yield name;

  yield `My name is ${name} and my number is 10`;
  yield {};
  yield [1,2,3]

  // Pseudo code, kind of the flow of generator functions:
  // yield getRequest
  // yield sendToRedux
}

// In order to start-up a generator:

const lister = myFirstGenerator();

// Now we have two different generators running and keeping track of where they're at:
const lister2 = myFirstGenerator();

console.log(lister.next());
console.log(lister.next());
console.log(lister2.next());
console.log(lister.next());
console.log(lister.next());
console.log(lister.next());


function* getSwitch() {
    while(true) {
      yield 'on';
      yield 'off';
    }
}

const lightSwitch = getSwitch();

console.log(lightSwitch.next());
console.log(lightSwitch.next());
console.log(lightSwitch.next());
console.log(lightSwitch.next());
console.log(lightSwitch.next());
