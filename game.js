class Result {
  constructor() {
    // 棋譜の初期化
    // type Game_record: [{
    //   player_number: number,
    //   click_pole: [float, float],
    //   clicked_pole: [float, float],
    //   player1: number,
    //   player2: number,
    //   player3: number,
    //   player4: number,
    // }]
    this.gameRecord = [];
    // ゲーム結果
    // type Result: {
    //   timestamp: string,
    //   player_number: number,
    //   final_scores: [number, number, number, number],
    //   game_record: GameRecord[],
    this.result = {};
    this.logs = []; // ログを保持する配列
  }

  // 棋譜を追加するメソッド
  addGameRecord(record) {
    this.gameRecord.push(record);
    console.dir(this.gameRecord); // ログに追加
    // ログのフォーマット修正
    const recordMessage = `\nGameRecord: \nplayerNumber: ${record.player_number}, \n clickPole: [${record.clicked_pole[0]}, ${record.clicked_pole[1]}], \n clickedPole: [${record.click_pole[0]}, ${record.click_pole[1]}], \n Player 1: ${record.player1} points, \n Player 2: ${record.player2} points, \n Player 3: ${record.player3} points, \n Player 4: ${record.player4} points,`;
    this.addLog(recordMessage); // ログに追加
  }

  // ゲーム結果を追加するメソッド
  addResult(playerNumber, finalScores) {
    this.result = {
      game_result:{
        timestamp: new Date().toISOString(),
        player_number: playerNumber,
        final_scores: finalScores,
        game_record: this.gameRecord,
      }
    };
    const resultMessage = `\nResult: \nplayerNumber: ${playerNumber}, \n finalScores: [${finalScores[0]}, ${finalScores[1]}, ${finalScores[2]}, ${finalScores[3]}]`;
    this.addLog(resultMessage); // ログに追加
  }

  // ログを記録するメソッド
  addLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage); // コンソールにも出力
  }

  // 棋譜を取得するメソッド
  getRecord() {
    return this.gameRecord;
  }

  // 棋譜とスコアを取得するメソッド
  getResult() {
    return this.result
  }

  getLogs() {
    return this.logs;
  }

  submit() {
    // const bodymock = JSON.stringify(
    //   {
    //     "game_result": {
    //       "timestamp": "2025-01-18T12:34:56.789Z",
    //       "player_number": 4,
    //       "final_scores": [
    //         20,
    //         15,
    //         10,
    //         30
    //       ],
    //       "game_record": [
    //         {
    //           "player_number": 1,
    //           "click_pole": [
    //             2.5,
    //             3.7
    //           ],
    //           "clicked_pole": [
    //             4.2,
    //             5.1
    //           ],
    //           "player1": 10,
    //           "player2": 0,
    //           "player3": 0,
    //           "player4": 0
    //         },
    //         {
    //           "player_number": 2,
    //           "click_pole": [
    //             5.6,
    //             6.8
    //           ],
    //           "clicked_pole": [
    //             7.3,
    //             8.4
    //           ],
    //           "player1": 10,
    //           "player2": 5,
    //           "player3": 0,
    //           "player4": 0
    //         }
    //       ]
    //     }
    //   }
    // ); // 送信するデータをJSON文字列に変換

    // サーバーに送信する処理を書く
    const body = JSON.stringify(this.getResult()); // 送信するデータをJSON文字列に変換
    const headers = {
      'Content-Type': 'application/json', // ヘッダーの指定（Content-Typeをjsonに設定）
    };

    // fetchを使用してPOSTリクエストを送信
    fetch('http://localhost:3000/api/result', {
      method: 'POST',  // POSTメソッド
      headers: headers,
      body: body,  // 送信するデータ
    })
    .then(response => response.json())  // レスポンスをJSONとして処理
    .then(data => {
      console.log('Success:', data);  // 成功した場合
    })
    .catch(error => {
      console.error('Error:', error);  // エラーが発生した場合
    });

    console.log(body);  // 送信するデータをコンソールに表示
    console.dir(body);  // 詳細に表示
  }
}

class Widget {
  constructor(cs) {
    this.ctx = cs.getContext('2d');
    this.w = cs.width;
    this.h = cs.height;
    this.scale = 0.9;
  }

  // coordination converting function
  convertCood(x, y) {
    const xs = ( this.scale*x+1)*this.w/2;
    const ys = (-this.scale*y+1)*this.h/2;
    return [xs, ys];
  }

  // helper methods for drawing:
  //   start (setStyle()) and end (strokeAndFill())
  setStyle(stroke, fill) {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = stroke;
    this.ctx.fillStyle = fill;
  }

  strokeAndFill() {
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.restore();
  }
}

class Board extends Widget {
  draw() {
    this.setStyle('black', 'gray');
    for (var i = 0; i < 6; i++) {
      var theta = i*Math.PI/3;
      var pos = this.convertCood(1.05*Math.cos(theta), 1.05*Math.sin(theta));
      this.ctx.lineTo(pos[0], pos[1]);
    };
    this.strokeAndFill();
  }
}

class Pole extends Widget {
  constructor(cs, x, y) {
    super(cs);
    var pos = this.convertCood(x, y);
    this.x = pos[0];
    this.y = pos[1];
    this.radius = 10;

    this.walls = [];
    this.lines = [];

    this.clicked = false;
    this.status = ['default'];
    this.colors = { 'default': 'yellowgreen',
                    'candidate': 'skyblue',
                    'wall': 'lavender' };
  }

  // function for drawing the pole
  draw() {
    var stroke = 'black';
    var fill = this.colors[this.status[0]];
    if (this.clicked) { fill = 'yellow' };
    this.setStyle(stroke, fill);
    this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    this.strokeAndFill();
  }

  checkHit(point) {
    return Math.pow(this.x-point.x, 2) + Math.pow(this.y-point.y, 2)
        <= Math.pow(this.radius, 2);
  }

  getCandidates() {
    var retvar = [];
    this.lines.forEach(line => {

      var flag = false; // if wall(s) can be added, the flag is true
      var from = this;
      var to;
      for (var i = 0; i < line.length; i++) {
        to = line[i];
        from.walls.forEach(w => {
          if ((w.to == to) || (w.from == to)) { flag |= !w.show; }});
        from = to;
      }
      if (flag) {
        var candidate = line.slice(-1)[0]; // the last pole of the line
        retvar.push(candidate);
      }
    });

    return retvar;
  }

  clickHandler() {
    var candidates = this.getCandidates();
    if (this.clicked) {
      candidates.forEach(candidate => {
        candidate.status.shift();
      });
    } else {
      candidates.forEach(candidate => {
        candidate.status.unshift('candidate');
      });
    }
    this.clicked = !this.clicked;
  }

  makeWall(last) {
    this.lines.forEach(line => {
      if (line.slice(-1)[0] == last) {
        var from = this;
        from.status = ['wall'];
        line.forEach(pole => {
          pole.status = ['wall'];
          from.showWall(pole);
          from = pole;
        });
      }
    });
  }

  showWall(to) {
    this.walls.forEach(wall => {
      if ((wall.to == to) || (wall.from == to)) { wall.show = true; }
    });
  }

  addWall(wall) { this.walls.push(wall); }

  addLines(poles) { this.lines.push(poles); }
}

class Wall extends Widget {
  constructor(cs, from, to) {
    super(cs);
    this.from = from;
    this.to = to;
    this.show = false;
  }

  // function for drawing the wall
  draw() {
    const stroke = 'azure';
    const fill = 'azure';
    if (this.show) {
      this.setStyle(stroke, fill);
      this.ctx.lineWidth = 10;
      this.ctx.moveTo(this.from.x, this.from.y);
      this.ctx.lineTo(this.to.x, this.to.y);
      this.strokeAndFill();
    }
  }
}

class Patch extends Widget {
  constructor(cs, walls) {
    super(cs);
    this.walls = [];
    this.vertexes = [];
    this.show = false;

    this.player = null;
    this.color = 'forestgreen';

    walls.forEach(wall => {
      this.walls.push(wall);
      if (!this.vertexes.includes(wall.from)) {
        this.vertexes.push(wall.from);
      }
      if (!this.vertexes.includes(wall.to)) {
        this.vertexes.push(wall.to);
      }
    });
  }

  // function for drawing the patch
  draw() {
    const stroke = this.color;
    const fill = this.color;
    if (this.show) {
      this.setStyle(stroke, fill);
      this.vertexes.forEach(vertex => {
        this.ctx.lineTo(vertex.x, vertex.y);
      });
      this.strokeAndFill();
    }
  }

  // set show_flag, player, and its color
  setPlayer(cp, color) {
    this.show = true;
    this.player = cp;
    this.color = color;
  }
}

class Container {
  constructor() { this.items = []; }

  addItem(item) { this.items.push(item); }

  getItem(idx) { return this.items[idx]; }

  refresh() { this.items.forEach(item => { item.draw(); }); }
}

class Poles extends Container {
  constructor(result) {
    super();
    this.clickedPole = null;
    this.result = result;    // Resultインスタンスを受け取る
    this.lastClicked = null;
  }

  checkEvent(point) {
    var success = false;

    this.items.forEach(pole => {
      if (pole.checkHit(point)) {
        if (this.clickedPole == null || this.clickedPole == pole) {
          // すでにクリックされたポールか、クリックされたポールがない場合
          pole.clickHandler();
          this.clickedPole = (this.clickedPole == null) ? pole : null;
        } else {
          // クリックされたポールが候補の一部である場合
          this.clickedPole.getCandidates().forEach(p => {
            if (p == pole) {
              // 候補のポールがクリックされた場合
              this.clickedPole.clickHandler();
              this.clickedPole.makeWall(pole);
              // クリックされたポールの座標を取得
              this.lastClicked = {
                clickPole: [pole.x, pole.y],  // クリックされたポールの座標
                clickedPole: [this.clickedPole.x, this.clickedPole.y],  // クリックされたポールの座標
              };
              this.clickedPole = null;
              success = true;
            };
          });
        }
      }
    });
    // 壁が構築された場合のみ true を返す
    return success;
  }
  getPoles() {
    return this.lastClicked;
  };
}


class Walls extends Container {
  addItem(wall) {
    super.addItem(wall);
    wall.from.addWall(wall);
    wall.to.addWall(wall);
  }
}

class Patches extends Container {
  constructor(area, players, result, poles) {
    super();
    this.area = area;
    this.numPlayers = players;
    this.currentPlayer = 0;
    this.colors = ['forestgreen', 'tomato', 'navy', 'gold'];
    this.player = ['Player 1 (green)', 'Player 2 (red)', 'Player 3 (blue)', 'Player 4 (yellow)'];
    this.result = result;  // Resultインスタンスを受け取る
    this.poles = poles;
  }

  update() {
    const cp = this.currentPlayer;
    const pColor = this.colors[cp];
    const lastClicked = this.poles.getPoles();

    this.items.forEach(patch => {
      if (patch.show) { return; }
      var flag = true;
      patch.walls.some(wall => { if (!wall.show) { flag = false; }}); // まだ壁が表示されていない場合
      if (flag) {
        patch.setPlayer(cp, pColor);
      }
    });

    const points = [];
    for (var i = 0; i < this.numPlayers; i++) { points.push(0); }
    this.items.forEach(patch => {
      points[patch.player]++;
    });
    // 棋譜を追加
    this.result.addGameRecord({
      player_number: this.currentPlayer + 1,
      click_pole: lastClicked.clickPole,
      clicked_pole: lastClicked.clickedPole,
      player1: points[0],
      player2: points[1],
      player3: points[2],
      player4: points[3],
    });
    this.currentPlayer = (this.currentPlayer + 1) % this.numPlayers;
    this.showMessage();

    var flag = true;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].show == false) { flag = false; }
    }
    // ゲームが終了した場合
    if (flag) {
      this.showFinalMessage();
      this.result.addLog('The game is finished.'); // ログ追加
    }
  }

  showMessage() {
    const message = this.player[this.currentPlayer] + "'s turn.";
    this.area.text(message);
    this.result.addLog(message); // ログ追加
  }

  showFinalMessage() {
    const points = [];
    for (var i = 0; i < this.numPlayers; i++) { points.push(0); }
    this.items.forEach(patch => { points[patch.player]++; });
    var str = '';
    for (var i = 0; i < this.numPlayers; i++) {
      str += this.player[i] + ' got ' + points[i] + ' points.<br />';
    }
    this.area.html(str);
    // 最終得点をログに追加
    let finalScores = `Final Scores:\n`;
    for (let i = 0; i < this.numPlayers; i++) {
      finalScores += `${this.player[i]}: ${points[i]} points\n`;
    }
    this.result.addResult(this.numPlayers, points); // ゲーム結果を追加
    this.result.submit(); // サーバーに送信
  }
}

// each pole's location, x and y
const positions = [
  [-0.5,                 0.8660254037844387],
  [-0.1666666666666667,  0.8660254037844387],
  [ 0.1666666666666667,  0.8660254037844387],
  [ 0.5,                 0.8660254037844387],

  [-0.6666666666666667,  0.5773502691896257],
  [-0.3333333333333333,  0.5773502691896257],
  [ 0.0,                 0.5773502691896257],
  [ 0.3333333333333333,  0.5773502691896257],
  [ 0.6666666666666667,  0.5773502691896257],

  [-0.8333333333333333,  0.2886751345948128],
  [-0.5,                 0.2886751345948128],
  [-0.1666666666666667,  0.2886751345948128],
  [ 0.1666666666666667,  0.2886751345948128],
  [ 0.5,                 0.2886751345948128],
  [ 0.8333333333333333,  0.2886751345948128],

  [-1.0,                 0.0               ],
  [-0.6666666666666667,  0.0               ],
  [-0.3333333333333333,  0.0               ],
  [ 0.0,                 0.0               ],
  [ 0.3333333333333333,  0.0               ],
  [ 0.6666666666666667,  0.0               ],
  [ 1.0,                 0.0               ],

  [-0.8333333333333333, -0.2886751345948128],
  [-0.5,                -0.2886751345948128],
  [-0.1666666666666667, -0.2886751345948128],
  [ 0.1666666666666667, -0.2886751345948128],
  [ 0.5,                -0.2886751345948128],
  [ 0.8333333333333333, -0.2886751345948128],

  [-0.6666666666666667, -0.5773502691896257],
  [-0.3333333333333333, -0.5773502691896257],
  [ 0.0,                -0.5773502691896257],
  [ 0.3333333333333333, -0.5773502691896257],
  [ 0.6666666666666667, -0.5773502691896257],

  [-0.5,                -0.8660254037844387],
  [-0.1666666666666667, -0.8660254037844387],
  [ 0.1666666666666667, -0.8660254037844387],
  [ 0.5,                -0.8660254037844387]
];

const lines = [
  [0, [[1, 2, 3], [5, 11, 18], [4, 9, 15]]],
  [1, [[5, 10, 16], [6, 12, 19]]],
  [2, [[6, 11, 17], [7, 13, 20]]],
  [3, [[2, 1, 0], [7, 12, 18], [8, 14, 21]]],
  [4, [[5, 6, 7], [10, 17, 24]]],
  [5, [[6, 7, 8], [10, 16, 22], [11, 18, 25]]],
  [6, [[11, 17, 23], [12, 19, 26]]],
  [7, [[6, 5, 4], [12, 18, 24], [13, 20, 27]]],
  [8, [[7, 6, 5], [13, 19, 25]]],
  [9, [[10, 11, 12], [16, 23, 29]]],
  [10, [[11, 12, 13], [17, 24, 30]]],
  [11, [[12, 13, 14], [17, 23, 28], [18, 25, 31]]],
  [12, [[11, 10, 9], [18, 24, 29], [19, 26, 32]]],
  [13, [[12, 11, 10], [19, 25, 30]]],
  [14, [[13, 12, 11], [20, 26, 31]]],
  [15, [[9, 4, 0], [16, 17, 18], [22, 28, 33]]],
  [16, [[10, 5, 1], [17, 18, 19], [23, 29, 34]]],
  [17, [[11, 6, 2], [18, 19, 20], [24, 30, 35]]],
  [18, [[17, 16, 15], [11, 5, 0], [12, 7, 3],
        [19, 20, 21], [24, 29, 33], [25, 31, 36]]],
  [19, [[18, 17, 16], [12, 6, 1], [25, 30, 34]]],
  [20, [[19, 18, 17], [13, 7, 2], [26, 31, 35]]],
  [21, [[20, 19, 18], [14, 8, 3], [27, 32, 36]]],
  [22, [[23, 24, 25], [16, 10, 5]]],
  [23, [[24, 25, 26], [17, 11, 6]]],
  [24, [[25, 26, 27], [18, 12, 7], [17, 10, 4]]],
  [25, [[24, 23, 22], [18, 11, 5], [19, 13, 8]]],
  [26, [[25, 24, 23], [19, 12, 6]]],
  [27, [[26, 25, 24], [20, 13, 7]]],
  [28, [[29, 30, 31], [23, 17, 11]]],
  [29, [[30, 31, 32], [23, 16, 9], [24, 18, 12]]],
  [30, [[24, 17, 10], [25, 19, 13]]],
  [31, [[30, 29, 28], [25, 18, 11], [26, 20, 14]]],
  [32, [[31, 30, 29], [26, 19, 12]]],
  [33, [[34, 35, 36], [28, 22, 15], [29, 24, 18]]],
  [34, [[29, 23, 16], [30, 25, 19]]],
  [35, [[30, 24, 17], [31, 26, 20]]],
  [36, [[35, 34, 33], [31, 25, 18], [32, 27, 21]]]
];

// the numbers indicate the index of the poles, from and to
const edges = [
  [0, 1], [1, 2], [2, 3], 
  [0, 4], [0, 5], [1, 5], [1, 6], [2, 6], [2, 7], [3, 7], [3, 8],
  [4, 5], [5, 6], [6, 7], [7, 8],
  [4, 9], [4, 10], [5, 10], [5, 11], [6, 11], [6, 12], 
    [7, 12], [7, 13], [8, 13], [8, 14],
  [9, 10], [10, 11], [11, 12], [12, 13], [13, 14],
  [9, 15], [9, 16], [10, 16], [10, 17], [11, 17], [11, 18],
    [12, 18], [12, 19], [13, 19], [13, 20], [14, 20], [14, 21],
  [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21],
  [15, 22], [16, 22], [16, 23], [17, 23], [17, 24], [18, 24],
    [18, 25], [19, 25], [19, 26], [20, 26], [20, 27], [21, 27],
  [22, 23], [23, 24], [24, 25], [25, 26], [26, 27],
  [22, 28], [23, 28], [23, 29], [24, 29], [24, 30], [25, 30],
    [25, 31], [26, 31], [26, 32], [27, 32],
  [28, 29], [29, 30], [30, 31], [31, 32],
  [28, 33], [29, 33], [29, 34], [30, 34], [30, 35], 
    [31, 35], [31, 36], [32, 36],
  [33, 34], [34, 35], [35, 36]
];

// the numbers indicate the index of the three surrounding edges
const triangles = [
  [3, 4, 11], [0, 4, 5], [5, 6, 12], [1, 6, 7], [7, 8, 13], 
  [2, 8, 9], [9, 10, 14],
  [15, 16, 25], [11, 16, 17], [17, 18, 26], [12, 18, 19],
    [19, 20, 27], [13, 20, 21], [21, 22, 28], [14, 22, 23],
    [23, 24, 29],
  [30, 31, 42], [25, 31, 32], [32, 33, 43], [26, 33, 34],
    [34, 35, 44], [27, 35, 36], [36, 37, 45], [28, 37, 38],
    [38, 39, 46], [29, 39, 40], [40, 41, 47],
  [42, 48, 49], [49, 50, 60], [43, 50, 51], [51, 52, 61],
    [44, 52, 53], [53, 54, 62], [45, 54, 55], [55, 56, 63],
    [46, 56, 57], [57, 58, 64], [47, 58, 59],
  [60, 65, 66], [66, 67, 75], [61, 67, 68], [68, 69, 76],
    [62, 69, 70], [70, 71, 77], [63, 71, 72], [72, 73, 78],
    [64, 73, 74],
  [75, 79, 80], [80, 81, 87], [76, 81, 82], [82, 83, 88],
    [77, 83, 84], [84, 85, 89], [78, 85, 86]
];

$(function() {
  // get the url parameters
  const url = new URL(window.location.href);
  const params = url.searchParams;
  var num = params.get('players');
  if (num < 2 || num > 4) { 
    window.alert('Players should be from 2 to 4.\nStart with 4 players.');
    num = 4;
  }

  // prepare for the graphics context
  const cs = $('#canvas').get(0);

  // prepare for the result
  const result = new Result();

  // create board
  (new Board(cs)).draw();

  //create poles
  const poles = new Poles(result);
  positions.forEach(pos => {
    poles.addItem(new Pole(cs, pos[0], pos[1]));
  });

  // create walls
  const walls = new Walls();
  edges.forEach(edge => {
    walls.addItem(new Wall(cs, poles.getItem(edge[0]),
                               poles.getItem(edge[1])));
  });

  // create patches
  // fix: 継承関係ごちゃついてる
  const patches = new Patches($('#msgarea'), num, result, poles);
  triangles.forEach(triangle => {
    patches.addItem(new Patch(cs,
      triangle.map(idx => { return walls.getItem(idx); })));
  });

  // create relationships between poles
  lines.forEach(info => {
    const poleIdx = info[0];
    const lineInfo = info[1];
    lineInfo.forEach(lpIdxes => {
      const lPoles = [];
      lpIdxes.forEach(lpIdx => { lPoles.push(poles.getItem(lpIdx)); }); 
      poles.getItem(poleIdx).addLines(lPoles);
    });
  });

  // drawing poles and display the first message
  poles.refresh();
  patches.showMessage();

  // caring the interaction with the user
  cs.addEventListener("click", e => {
    const rect = cs.getBoundingClientRect();
    if (poles.checkEvent({ x: e.clientX - rect.left,
                           y: e.clientY - rect.top })) {
      // the case that a line is created
      patches.update();
    }
    // reflesh screen
    patches.refresh();
    walls.refresh();
    poles.refresh();
  });
});
