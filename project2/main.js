const monster = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3, // физический урон
            "magicDmg": 0,    // магический урон
            "physicArmorPercents": 20, // физическая броня , восстанавливает n-ое число процентов от физ. урона ?
            "magicArmorPercents": 20,  // магическая броня
            "cooldown": 0,     // ходов на восстановление
            "availability": 0
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3,
            "availability": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 50,
            "magicArmorPercents": 0,
            "cooldown": 2,
            "availability": 2
        },
    ],
    lastMove: null
};

let player = {
    maxHealth: 10,
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 50,
            "cooldown": 0,
            "availability": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 4,
            "availability": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercents": 0,
            "magicArmorPercents": 0,
            "cooldown": 3,
            "availability": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercents": 100,
            "magicArmorPercents": 100,
            "cooldown": 4,
            "availability": 4
        },
    ],
    lastMove: null // последнее примененное действие
};


function getRandom(arr) {
    const randIdx = Math.floor(Math.random() * arr.length);
    return  arr[randIdx];
}

const questions = [
    'Enter your name',
    'Choose initial health value'
];

const readln = require('readline');
const cl = readln.createInterface({input: process.stdin, output: process.stdout});

const ask = async (q) => {
    return new Promise((res, rej) => {
        cl.question(q + ' > ', answer => {
            res(answer);
        })
    });
};

const processAnswer = (answer, i) => {
    switch (i) {
        case 0:
            player.name = answer;
            console.log(`\n Welcome to the game, ${player.name}`);
            break;
        case 1:
            if (!isNaN(parseInt(answer))) {
                player.maxHealth = answer;
            }
            console.log(`Your health is ${player.maxHealth}`);
            break;
    }
};

const getIdxsOfAvailableMoves = (object) => {
    return object.moves.map((move, idx) => move.availability === move.cooldown ? idx : undefined).filter(m => m !== undefined);
};

const processMove = (activePlayer, rival, move) => {
    console.log(`${activePlayer.name} have chosen: ${move.name}`);

    activePlayer.lastMove = move;

    if(move.physicalDmg > 0) {
        rival.maxHealth -= move.physicalDmg;
        console.log(`Physical damage to ${rival.name} -${move.physicalDmg}`);
    } else if(move.magicDmg > 0) {
        rival.maxHealth -= move.magicDmg;
        console.log(`Magic damage to ${rival.name} -${move.magicDmg}`);
    }

    let recValue = null;
    if(move.physicArmorPercents > 0 && rival.lastMove && rival.lastMove.physicalDmg > 0) {
        recValue = (rival.lastMove.physicalDmg * move.physicArmorPercents) / 100;
        activePlayer.maxHealth += recValue;
        console.log(`+${recValue} to ${activePlayer.name}`);
    }
    if(move.magicArmorPercents > 0 && rival.lastMove && rival.lastMove.magicDmg > 0) {
        recValue = (rival.lastMove.magicDmg * move.magicArmorPercents) / 100;
        activePlayer.maxHealth += recValue;
        console.log(`+${recValue} to ${activePlayer.name}`);
    }

    move.availability = 0;

    console.log(`Health of ${activePlayer.name} : ${activePlayer.maxHealth}`);
    console.log(`Health of ${rival.name}: ${rival.maxHealth}`);
};

const processPlayerMove = (action) => {
    action = parseInt(action);

    if(!isNaN(action) && 0 < action < player.moves.length) {
        const move = player.moves[action];

        if(move.availability === move.cooldown) {
            processMove(player, monster, move);

            return true;
        } else {
            console.log(`This action is temporarily blocked.`+
            ` It will be available in ${move.cooldown - move.availability} turns`);

            return false;
        }
    }
};

const addAvailability = () => {
    monster.moves.map((move) => move.availability !== move.cooldown ? ++move.availability : move.availability);
    player.moves.map((move) => move.availability !== move.cooldown ? ++move.availability : move.availability);
};

const keepAsking = async () => {
    await ask('\nYour turn:').then(async (move) => {
        const res = await processPlayerMove(move);
        if(!res) return keepAsking();
    });
};

const play = async () => {
    for (let i = 0; i < questions.length; i++) {
        await ask(questions[i]).then((answer) => {
            processAnswer(answer, i);
        });
    }

    console.log(`\n\n The game is about to start...
                                Instructions: 0 - ${player.moves[0].name},
                                              1 - ${player.moves[1].name},
                                              2 - ${player.moves[2].name},
                                              3 - ${player.moves[3].name}`);

    while (true) {
        console.log(getIdxsOfAvailableMoves(monster));

        const action = monster.moves[getRandom(getIdxsOfAvailableMoves(monster))];
        processMove(monster, player, action);

        if(player.maxHealth <= 0 || monster.maxHealth <= 0) {
            if(player.maxHealth > monster.maxHealth) {
                console.log(`You won! Congratulations!`);
            } else if(player.maxHealth < monster.maxHealth) console.log(`Sorry, you lose!`);
            console.log(`Score: you ${player.maxHealth} vs monster ${monster.maxHealth}`);
            break;
        }

        await keepAsking();

        addAvailability();
    }
};

play();