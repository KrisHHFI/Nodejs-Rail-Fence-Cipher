// Simple shift cipher encryption and decryption program. Created by Kristopher Pepper, in 2022.
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const alphabetLetters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
console.log(" ________________________________________________________________________ \n|\\                /\\                /\\                /\\                /|\n" +
"| \\              /  \\              /  \\              /  \\              / |\n|__\\____________/____\\____________/____\\____________/____\\____________/__|\n" +
"|   \\          /   ___\\__________/______\\__________/____  \\          /   |\n|    \\        /   |     Rail Fence Cipher Program       |  \\        /    |\n" +
"|_____\\______/____| Created by Kristopher Pepper, 2023. |___\\______/_____|\n|      \\    /      ‾‾‾‾‾‾\\‾‾‾‾/‾‾‾‾‾‾‾‾‾‾‾‾\\‾‾‾‾/‾‾‾‾‾‾‾     \\    /      |\n" +
"|       \\  /              \\  /              \\  /              \\  /       |\n|________\\/________________\\/________________\\/________________\\/________|\n" +
"\nNote:\n- Program uses 3 rails.\n- Only works with Latin alphabet characters.\n- Punctuation and spaces are removed.\n");
RailFenceCipher();

function RailFenceCipher() {

  readline.question('Create cipher = c | Decrypt cipher = d | Exit = e : ', userPrompt => {
    let processedString = [];
    let encryptedString = [];
    let encryptedStringPattern = [];
    let encryptedStringWithDots = [];
    let length = 0;
    let rails = 3;
    let k = 0;

    //------------------ Encrypt String------------------
    if (userPrompt == 'c') {
      readline.question('\nEnter text: ', inputtedString => {
        if (inputtedString.length > 110 || inputtedString.length < 4 ) {
          console.log('Error, enter between 4 and 110 characters.\n');
          RailFenceCipher('c');
        } else {
          const inputtedStringArray = inputtedString.split("");
          inputtedStringArray.forEach(processMessage);

          // inputtedString to array 
          function processMessage(item, index) {
            for (let i = 0; i < alphabetLetters.length; i++) {
              if (item == alphabetLetters[i] || item.toLowerCase() == alphabetLetters[i]) {
                processedString.push(alphabetLetters[i]);
              }
            }
          }

          length = processedString.length;
          k = length / (2 * (rails - 1));
          let repeatPeriod = 2 * (rails - 1);
          let counter = 0;
          let intervalCounter = 1;
          processedString.forEach(encryptMessage);

          // Processed string is encrypted, according to the counter and rails.
          function encryptMessage(item, index) {
            if (counter > length - 1) {
              counter = 0 + intervalCounter;
              intervalCounter++;
              rails = rails - 1;
              repeatPeriod = 2 * (rails - 1);
              if (repeatPeriod == 0) {
                repeatPeriod = rails + intervalCounter;
              }
            }
            encryptedString.push(processedString[counter]);
            encryptedStringWithDots.push(processedString[counter], '...');
            counter = counter + repeatPeriod;
          }

          stringLength = encryptedStringWithDots.length;
          let newLineCount = 1;

          // The rail fence cipher pattern
          for (let i = 0; i < encryptedStringWithDots.length; i++) {
            if (!(i % (stringLength / 3)) && !(i == 0)) {
              encryptedStringPattern.push('\n');
              for (let x = 0; x < newLineCount; x++) {
                encryptedStringPattern.push('.');
              }
              newLineCount++;
            }
            encryptedStringPattern.push(encryptedStringWithDots[i]);
          }

          let kOddNumber = false;
          let kCompensation = 0;
          let kCompensation75 = 0;
          let kCompensation5 = false;

          // K (rail) compensation, if not a whole number.
          if (!(Math.floor(k) === k) && !(k == 0)) {
            if (k.toFixed(2).endsWith('.75')) {
              k = Math.ceil(k);
              kOddNumber = true;
              kCompensation75++;
              kCompensation++;
            } else if (k.toFixed(1).endsWith('.5')) {
              k = Math.ceil(k);
              kOddNumber = true;
              kCompensation++;
              kCompensation5 = true;
            } else {
              k = Math.ceil(k);
              kOddNumber = true;
              kCompensation++;
            }
          }

          // The tedious section below creates the proper fence pattern
          let rail1 = [];
          let rail2 = [];
          let rail3 = [];

          // rail1
          for (let i = 0; i < k; i++) {
            if (kCompensation75 == 1 && i == k - 1) {
              rail1.push(encryptedString[i] + '..');
            } else if (kCompensation5 == true && i == k - 1) {
              rail1.push(encryptedString[i] + '.');
            } else if (kOddNumber == true && i == k - 1) {
              rail1.push(encryptedString[i] + '');
            } else {
              rail1.push(encryptedString[i] + '...');
            }
          }

          // rail2
          for (let i = k; i < length - k + kCompensation - kCompensation75; i++) {
            if (kCompensation5 == true && i == length - k + kCompensation - 1) {
              rail2.push(encryptedString[i] + '');
            } else if (kOddNumber == true && i == length - k + kCompensation - 1) {
              rail2.push(encryptedString[i] + '.');
            } else {
              if (i == length - k - 1 + kCompensation) {
                rail2.push(encryptedString[i]);
              } else {
                rail2.push(encryptedString[i] + '.');
              }
            }
          }

          if (kOddNumber == true) {
            kCompensation = kCompensation - 2;
          }

          // rail3
          for (let i = length - k - kCompensation - kCompensation75; i < length; i++) {
            if (kCompensation5 == true && i == length - 1) {
              rail3.push(encryptedString[i] + '...');
            } else if (kOddNumber == true && i == length - 1 && kCompensation75 == 0) {
              rail3.push(encryptedString[i] + '..');
            } else if (kCompensation75 == 1 && i == length - 1) {
              rail3.push(encryptedString[i]);
            } else if (i == length - 1) {
              rail3.push(encryptedString[i] + '.');
            } else {
              rail3.push(encryptedString[i] + '...');
            }
          }
          // The encryption output. Both the pattern and encrypted string.
          rail1 = rail1.join('');
          rail2 = rail2.join('');
          rail3 = rail3.join('');

          let allRails = [];
          allRails.push(rail1 + '\n.' + rail2 + '\n..' + rail3);
          allRails = allRails.join(',');

          console.log('\nRail Fence Pattern:\n' + allRails + '\n\nEncrypted String: ' + encryptedString.join('') + '\n');
          RailFenceCipher();
        }
      });
    //------------------ Decrypt String------------------
    } else if (userPrompt == 'd') {
      readline.question('\nEnter encrypted text: ', inputtedString => {
        if (inputtedString.length > 110 || inputtedString.length < 4 ) {
          console.log('Error, enter between 4 and 110 characters.\n');
          RailFenceCipher('c');
        } else {
          const inputtedStringArray = inputtedString.split("");
          // Pass inputtedString to array. Once letter at a time. 
          inputtedStringArray.forEach(processMessage);

          function processMessage(item, index) {
            for (let i = 0; i < alphabetLetters.length; i++) {
              if (item == alphabetLetters[i] || item.toLowerCase() == alphabetLetters[i]) {
                processedString.push(alphabetLetters[i]);
              }
            }
          }

          length = processedString.length;
          let k = length / (2 * (rails - 1));
          let kCompensation = 0;
          // The K compensation, if not a whole number. Ensures correct rail lengths. 
          if (!(Math.floor(k) === k) && !(k == 0)) {
            if (k.toFixed(2).endsWith('.75')) {
              k = Math.ceil(k);
              kCompensation++;
            } else if (k.toFixed(1).endsWith('.5')) {
              k = Math.ceil(k);
              kCompensation++;
            } else {
              k = Math.ceil(k);
              kCompensation = kCompensation + 2;
            }
          }
          // The three rails are cut from the passed string, according to the previous calculation
          let rail1 = processedString.slice(0, k);
          let rail2 = processedString.slice(k, k + k + k - kCompensation);
          let rail3 = processedString.slice(k + k + k - kCompensation, k + k + k + k - kCompensation);

          // The decryption of the passed string. In short, the correct characters are taken from the correct rail.
          // rail 1[0], rail 2[0], rail 3[0], rail2[1].. and so on. Rail length varies accoring to length and k calculation.
          let i = 0;
          let rail2Compensation = -1;
          let rail2CompensationTimesTriggered = 1;

          while (i < rail2.length) {
            encryptedString.push(rail1[i]);
            rail2Compensation++;
            encryptedString.push(rail2[i + rail2Compensation]);
            encryptedString.push(rail3[i]);
            i++;
            if (rail2Compensation == rail2CompensationTimesTriggered) {
              encryptedString.push(rail2[i + rail2Compensation]);
              rail2CompensationTimesTriggered++;
            } else {
              encryptedString.push(rail2[i]);
            }
          }
          console.log('\nUnencrypted String: ' + encryptedString.join('') + '\n');
        }
        RailFenceCipher();
      });
    //------------------ Exit Program------------------
    } else if (userPrompt == 'e') {
      readline.close();
      return;
    //------------------ Incorrect Value, Try Again------------------
    } else {
      console.log('Incorrect value, try again.\n');
      RailFenceCipher();
    }
  });
}