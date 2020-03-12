const fs = require('fs');
const path = require('path');

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
};

const getRandomQuestions = (max) => {
    let arr = [];
    let m = [0];
    let n = 0;

    let start = 0;
    while (start < 9) m.push(++start);

    for (let i = 0; i < max; i++) {
        n = getRandomInt(m.length);
        arr[i] = m.splice(n, 1);
    }

    return arr;
};

let score = 0;

const processAnswer = (answer, trueAnswer) => {
    answer = parseInt(answer);
    trueAnswer = parseInt(trueAnswer);

    if (!isNaN(answer) && 0 < answer < 5 && !isNaN(trueAnswer)) {
        if (answer === trueAnswer) {
            console.log('Correct!');
            score++;
        } else {
            console.log('Wrong!');
        }
    }
};

const readln = require('readline');
const cl = readln.createInterface({input: process.stdin, output: process.stdout});

const ask = async (q) => {
    return new Promise((res, rej) => {
        cl.question(`${q[0]}?\n1 - ${q[2]}\n2 - ${q[3]}\n3 - ${q[4]}\n4 - ${q[5]}\nYour answer > `, answer => {
            res(answer);
        })
    });
};

const idxs = getRandomQuestions(5);

const dirs = fs.readdirSync(path.join(__dirname, './questions'))
    .map(file => {
        return path.resolve(__dirname, './questions', file);
    });

const play = async () => {
    let count = idxs.length;
    while (count) {
        const fileStream = fs.createReadStream(dirs[count]);

        const rl = readln.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        count--;

        let lines = [];
        for await (const line of rl) {
            lines.push(line);
        }

        let answer = await ask(lines);
        processAnswer(answer, lines[1]);

        if(count===0) {
            const result = (score / idxs.length) * 100;
            console.log(`${score} correct answers\n${result}%`);
            return;
        }
    }
};

play();


