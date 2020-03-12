function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let rand = Math.random() * (max - min + 1) + min;
    return Math.floor(rand);
}

function getRandomNum(min, max, len) {
    let arr = [];
    let m = [];
    let n = 0;

    if(max - min < len - 1) return;

    for(let i=0; i<=(max-min); i++) m[i] = i + min;

    for(let i=0; i<len; i++) {
        n = Math.floor(Math.random() * (m.length));
        arr[i] = m.splice(n, 1);
    }

    return arr;
}

function checkNumber1(guessVal, trueVal) {
    let count = 0;

    guessVal.split('').map((val, idx) => {
        if(val == trueVal[idx]) {
            count++;
        }
    });

    return count;
}

function checkNumber2(guessVal, trueVal) {
    let count = 0;
    guessVal.split('').map((val1, idx1) => {
        if(trueVal.find((val2, idx2) => (val1 == val2) && (idx1 !== idx2))) {
            count++;
        }
    });

    return count;
}

const numLength = getRandomInt(3, 6);

let generatedNumber = getRandomNum(2, 9, numLength);

let attempts = 5;

let input = process.stdin;
let output = process.stdout;
input.setEncoding('utf-8');

input.on('data', (data) => {
    if(attempts) {
        let guessNum = parseInt(data);
        if (!isNaN(guessNum) && guessNum.toString().split('').length === numLength) {
            const num1 = checkNumber1(guessNum.toString(), generatedNumber);
            output.write(`\nThe number of matching digits in their places ${num1}`);

            const num2 = checkNumber2(guessNum.toString(), generatedNumber);
            output.write(`\nThe number of matching digits that are not in their places ${num2}`);

            if(parseInt(generatedNumber.join('')) === parseInt(guessNum.toString())) {
                output.write('\nCongratulations! You got it right!');
                process.exit();
            }
        } else {
            output.write(`\nCheck your input!`);
        }
        --attempts !== 0 && ask();
    } else {
        output.write('\nNo more chance to guess');
        process.exit();
    }
});

output.write(`We have selected a random ${generatedNumber.length}-digit number. See if you can guess it in ${attempts} turns.`);
ask();

function ask() {
    output.write('\n Enter your guess');
    output.write(' > ');
}