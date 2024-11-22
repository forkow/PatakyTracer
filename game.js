window.addEventListener('load', () => {
    startGame();
});

const COLORS = ["red", "green", "cyan", "purple", "lime", "#ff69d0", "yellow", "white"];

const FALL_SPEED = 2;
const SPAWN_CHANCE = 0.01;
const MAX_DROPPED = 10;

function startGame() {
    let currentColor = COLORS[(Math.random() * COLORS.length) >> 0];
    let packets = [];
    let pc = createPc(currentColor);

    let $gamePlay = document.getElementById('game-play');
    let $gameStatDropped = document.getElementById('game-stat-dropped');
    let $gameStatOk = document.getElementById('game-stat-ok');

    document.getElementById('game-stat-dropped-max').innerText = MAX_DROPPED;

    let fallSpeed = FALL_SPEED;
    let spawnChance = SPAWN_CHANCE;

    window.addEventListener('mousemove', (e) => {
        let w = parsePx(getComputedStyle(pc).width);
        pc.style.left = (e.clientX - w/2) + 'px';
    });

    window.addEventListener('mousedown', () => {
        pc.active = false;
        pc.style.background = 'black';
    });

    window.addEventListener('mouseup', () => {
        pc.active = true;
        pc.style.background = pc.pcColor;
    });

    function updateGame() {
        if (Math.random() <= spawnChance) {
            packets.push(createPacket(COLORS[(Math.random() * COLORS.length) >> 0]));
        }

        for (let i = 0; i < packets.length; i++) {
            let packet = packets[i];

            packet.style.top = parsePx(packet.style.top) + FALL_SPEED + 'px';
            if (parsePx(packet.style.top) >= $gamePlay.clientHeight) {
                $gamePlay.removeChild(packet);
                packets.splice(i, 1);

                if (packet.packetColor == currentColor) {
                    $gameStatDropped.innerText -= -1;
                }

                fallSpeed += 0.001;
            } else if (touchPc(pc, packet) && pc.active) {
                $gamePlay.removeChild(packet);
                packets.splice(i, 1);
                if (packet.packetColor == pc.pcColor) {
                    if (Math.random() > 0.5) {
                        fallSpeed += 0.25;
                    } else {
                        spawnChance += 0.015;
                    }
                    $gameStatOk.innerText -= -1;
                } else {
                    $gameStatDropped.innerText -= -1;
                }
            }

            if ($gameStatDropped.innerText >= MAX_DROPPED) {
                gameOver();
                return;
            }
        }

        requestAnimationFrame(updateGame);
    }

    updateGame();

}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
}

function createPacket(color, pos) {
    let back = document.createElement('div');
    back.style.backgroundColor = color;
    back.style.visibility = 'none';
    back.style.position = 'absolute';
    back.style.top = '-100px';
    back.style.left = window.innerWidth * Math.random() - 10 + 'px';
    back.packetColor = color;

    let pkt = back.appendChild(document.createElement('img'));
    pkt.src = 'img/packet.png';
    pkt.style.width = '50px';
    pkt.style.userSelect = 'none';
    pkt.draggable = false;

    document.getElementById('game-play').appendChild(back);

    return back;
}

function createPc(color, pos) {
    let pc = document.createElement('img');
    pc.src = 'img/pc.png';
    pc.style.width = '100px';
    pc.style.background = color;
    pc.style.position = 'absolute';
    pc.style.bottom = '10%';
    pc.pcColor = color;

    pc.draggable = false;
    pc.style.userSelect = 'none';

    document.getElementById('game-play').appendChild(pc);

    return pc;
}

function parsePx(px) {
    return parseFloat(px.substring(0, px.length - 2));
}

function touchPc(pc, packet) {
    let x1 = parsePx(getComputedStyle(pc).left);
    let y1 = parsePx(getComputedStyle(pc).top);
    let x2 = parsePx(getComputedStyle(packet).left);
    let y2 = parsePx(getComputedStyle(packet).top);

    let w1 = parsePx(getComputedStyle(pc).width);
    let h1 = parsePx(getComputedStyle(pc).height);
    let w2 = parsePx(getComputedStyle(packet).width);
    let h2 = parsePx(getComputedStyle(packet).height);
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}
