//В общем следующая супер задача, нарисовать кружочки в начале и конце каждой линии на полу, только тогда можно будет по ним многоугольники закрашенные
//на полу нарисовать

//В общем в renderWall нужно нарисовать все кружочки

//Ну и конечно попробовать не запоминать в массив все линии на полу которые были нарисованы чтобы их повторно не рисовать, а в CastRay2 запоминать только
//последнюю нарисованную полоску и при выходе из него её последнюю рисовать

//Нужно взять все кружочки из полосок на полу и все кружочки из стен, сопоставить их и как-то вычислить из этого всего квадратики на полу

// const map = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
//   [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
//   [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
//   [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
//   [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
//   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
//   [1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1],
//   [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
//   [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];

//Когда стоишь в углу, справа образуются лучи за гранью экрана, за последним казалось бы лучём
//сделать кнопки чтобы сужать и разужать угол обзора
//кнопку чтобы стены рандомно меняли цвет через интервал
//кнопку чтобы сносить стену?
//режим автопоиска решения лабиринта
//режим ручного поиска
//текстурирование. сделать в разных коридорах разные текстуры
//режим цветных стен, монохромных, текстурированных
//скринсейвер сделать где автоматически ищется выход
//выход сделать длиннющщим коридором в который с ускорением улетает игрок, происходит фэйдаут и начинается всё заново



var map1 = [
  "1111111111111",
  "1           1",
  "1 111111111 1",
  "1 1       1 1",
  "1 1   P1  1 1",
  "1 1   1   1 1",
  "1 1         1",
  "1 11111111111",
  "1           1",
  "1111 11111 11",
  "1   1   1   1",
  "1  11   1 1 1",
  "1   1   1   1",
  "11 111 111 11",
  "1           1",
  "1           1",
  "1           1",
  "1           1",
  "1           1",
  "1    OWX    1",
  "1           1",
  "1      1 1  1",
  "1      1 1  1",
  "111111111 111",
  "1           1",
  "1   Z       1",
  "1           1",
  "1111111111111",
];


// map2 = RoomGen().split("\n")

// map1=[]
// map2.forEach(element => {
//   if (element != "") map1.push(element)
// });

// map1.forEach((row, y) => {
//   map1[y]=row.replaceAll(" ", "0").split("")
// });


function Init()
{

  window.arduino = false
  window.monochrome = false
  window.renderRaysDebug = false
  window.renderRaysDebug_Debugger = false
  window.renderRayDebugStartingRay = 0
  window.renderRayDebugCurRay = 0
  window.AnimationFrame = true
  window.minimapVisible = false

  window.beautify = true

  window.frame_count = 0;
  window.seconds = Date.now()
  window.CELL_SIZE = 32;
  
  

  var map1 = RoomGen()
  map1.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell=="0" || cell=="1") 
      map1[y][x]=parseInt(cell)
  
      if (cell==" ")
      {
        map1[y][x]=0
      } else if(cell == encode_argb(255,254,254,254))
      {
        map1[y][x] = 0//encode_argb(255,254,0,0)
      } else
      {
        map1[y][x] = parseInt(cell)//Окраска всего остального
        if (x == 0 || y == 0 || x == row.length-1 || y == map1.length-1)
        {
          map1[y][x] = encode_argb(255,0,128,128)//Окраска периметра
        }
      }
    });
  });
  
  
  map1 = new MazeBuilder(5, 5);
  
  map1 = map1.maze
  
  map1.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.length==0) 
      {
        map1[y][x]=parseInt(0)
      } else
      {
        map1[y][x]=random_rgb();
      }
    });
  });
  
  var corridor_length = 10
  //corridor_length = map1.length + corridor_length
  var map1_width = map1[0].length
  var map1_height = map1.length
  for (let ii = map1_width; ii < corridor_length+map1_width+1; ii++) {
    
    for (let i = 0; i < map1_height; i++) {

      if (i==9)
      {
        map1[i][ii] = parseInt(0);
      } else if (i>=1 && i<=map1_height-4 && ii != corridor_length+map1_width)
      {
        map1[i][ii] = parseInt(0);
      }
      else
      {
        map1[i][ii] = random_rgb();
      }
    } 
  }


  

  //map1[8][map1_width+corridor_length-2] = parseInt(0)
  map1[map1_width-2][map1_height-1] = parseInt(0)
  map1[map1_width-2][corridor_length+map1_width] = encode_argb(255,255,255,255)

  map1[1][0] = encode_argb(255,0,0,0)
  


  // 
  // map1[9][11] = encode_argb(255,255,255,255)
  // map1[10][11] = encode_argb(255,255,255,255)

  
  
  
  //const map=map1
  
  //Где справа между стенками при обратном проходе полоски не прорисовываются
  if (window.beautify != true)
  {
    window.map = JSON.parse(`[[-10974029,-5086044,-7044163,-8688535,-9979715,-8670342,-9415031,-7423666,-8688262,-8539570,-8567678],[-7779508,0,0,0,0,0,-8556205,0,0,0,-11511997],[-11292547,-4501389,-9989478,-9331065,-4438162,0,-9399364,0,-12216199,-5730134,-5407597],[-6459575,0,0,0,0,0,-4219998,0,0,0,-6178184],[-9348462,0,-5731959,-9793658,-10504271,-5277015,-6912925,-7358592,-5338999,0,-10916971],[-4938865,0,0,0,0,0,0,0,0,0,-10858310],[-11112295,0,-10848869,0,-6653030,0,-11630977,0,-6192757,0,-7099290],[-4349539,0,-4949330,0,-6128307,0,-6133646,0,-4822709,0,-7450488],[-4807847,0,-11494785,-4212842,-8540293,-4299649,-9585754,-5285275,-10448491,0,-8282245],[-6845065,0,0,0,0,0,-6312315,0,0,0,-7948148],[-11960732,-5791827,-11766370,-10896523,-9676451,-9194646,-8738225,-9347663,-5741699,-6656594,-12096178]]`)
  } else
  {
    window.map = map1
  }

  window.player = {
    x: CELL_SIZE * 1.1, //x: CELL_SIZE * 2.5,
    y: CELL_SIZE * 1.1, //y: CELL_SIZE * 16,
    angle: toRadians(45),
    speed: 0,
    rotateSpeed: 0,
    strifeSpeed: 0,
  };
  
  
  //Где справа между стенками при обратном проходе полоски не прорисовываются
  // if (true)
  // {
  //   player.x = 36.717477171126944
  //   player.y = 170.17699802485475
  //   player.angle = 0.19634954084938488
  // }
  
  //Где справа между стенкамм ещё какая-то линия не прорисовывается
  if (window.beautify != true)
  {
    player.x = 40.82416655732636
    player.y = 241.0192749320997
    player.angle = 4.9960049838337905
  }

  //Где у стены только два кружочка с координатами а третий почему-то нет
  if (window.beautify != true)
    {
      player.x = 32.08583107480677
      player.y = 110.6506948781867
      player.angle = 0.6544984694978931
    }
  

  //{"x":32.08583107480677,"y":110.6506948781867,"angle":0.6544984694978931,"speed":0,"rotateSpeed":0,"strifeSpeed":0}

}

Init()

//const map=JSON.parse('[[-5483342,-10904985,-7753145,-6328474,-8543649,-7778632,-7297448,-9729133,-6596973,-8744581,-7383117],[-7320217,0,0,0,-8802981,0,0,0,-11044250,0,-6524827],[-9352027,0,-8425122,0,-8609423,0,-7830336,-10578782,-8358023,0,-9082198],[-6790296,0,-5458810,0,0,0,0,0,0,0,-11636143],[-8943176,0,-11833705,-8601742,-7248826,-4282985,-8614505,-10569839,-7971695,-8670825,-6912134],[-7958595,0,-9852240,0,-4493692,0,0,0,-6316653,0,-8363909],[-4493440,0,-8890482,0,-10447022,0,-11428772,0,-5815467,0,-4755360],[-4946341,0,-5606256,0,-4956244,0,-12083278,0,0,0,-10707369],[-10840935,0,-6252184,0,-9610142,0,-9388618,-6201161,-9152087,-6729648,-7499080],[-5937560,0,0,0,0,0,0,0,0,0,-5652839],[-7511121,-11965088,-7907773,-11447458,-5217470,-10271332,-9470305,-6509956,-8676983,-6111820,-7366816]]')

function random_rgb()
{
  var r = Math.round(Math.random()*128+64)
  var g = Math.round(Math.random()*128+64)
  var b = Math.round(Math.random()*128+64)
  return encode_argb(255,r,g,b)
}

const v_step = 1 //горизонтальное разрешение



window.textures = []
window.texturesV = []
window.texturesH = []

window.seg_sqrt=5
window.seg_colors=[]
for (let clr = 0; clr < window.seg_sqrt*window.seg_sqrt; clr++) {
  var r = 0
  var g = 0
  var b = Math.round(Math.random()*128+64)
  seg_colors.push("rgb("+r+","+g+","+b+")")
}

const TICK = 0;



const FOV = toRadians(90);//угол обзора

const COLORS = {
  floor: "lightgrey", // "#ff6361" //d52b1e
  ceiling: "grey", // "#012975",
  wall: "#013aa6", // "#58508d"
  wall2: "rgb(1,52,148)", // "#58508d"
  wallDark: "#012975", // "#003f5c"
  wallDark2: "rgb(1,33,92)", // "#003f5c"
  rays: "#ffa600",
  clin: "rgb(1,20,54)",
};

// const COLORS = {
//   floor: "#000000", // "#ff6361" //d52b1e
//   ceiling: "#000000", // "#012975",
//   wall: "#013aa6", // "#58508d"
//   wall2: "rgb(1,52,148)", // "#58508d"
//   wallDark: "#012975", // "#003f5c"
//   wallDark2: "rgb(1,33,92)", // "#003f5c"
//   rays: "#ffa600",
//   clin: "#000000",
// };



//Где линии рисуются поверх стены
// if (true)
// {
//   player.x = 37.72752928151708
//   player.y = 285.81060326390923
//   player.angle = 5.772676500971265
// }
  

//{"x":37.72752928151708,"y":285.81060326390923,"angle":5.772676500971265,"speed":0,"rotateSpeed":0,"strifeSpeed":0}


//var player = JSON.parse(`{"x":36.717477171126944,"y":170.17699802485475,"angle":0.19634954084938488,"speed":0,"rotateSpeed":0,"strifeSpeed":0}`)


//if (true) { player.x=32.17463634705778; player.y=735.8772335331196; player.angle=-0.7810348402674635; }

//if (true) { player.x=32.17463634705778; player.y=735.8772335331196; player.angle=-0.7810348402674635; }

if (false)//где пол экрана пропадает
{
  player.x = 94.80357114831854
  player.y = 526.9435659901137
  player.angle = 0.06544984694979927 
}

if (false)
{
  player.x = 271.2107653507101
  player.y = 174.41214027814934
  player.angle = -3.2114058236695686
}



//copy("if (true) { player.x=" + player.x + "; player.y=" + player.y + "; player.angle=" + player.angle + "; }")
//if (true) {  player.x = 114.41770291593146;  player.y = 538.011632192554;  player.angle = -1.4660765716752413;}//полоса перед глазами 

//if (true) { player.x=54.4022133387282; player.y=83.8482645773529; player.angle=0.07417649320975563; } //множественные лишние лучи

//if (true) { player.x=250.32523520643116; player.y=91.17461872504285; player.angle=3.1154127148098745; }// слева лучи обрубаются

//if (true) { player.x=162.9930381601363; player.y=96.29114620704023; player.angle=6.278821984049619; }
//if (true) { player.x=66.99011059170066; player.y=604.2267168137766; player.angle=30.887964437169614; }//пол экрана пропадает
//if (true) { player.x=95.3932710033198; player.y=564.8829696872965; player.angle=-13.548118318605987; }//пол экрана пропадает
//if (false) { player.x=207.3280906199454; player.y=532.7695603056022; player.angle=29.78404368528266; } //насквозь проходит
//if (true) { player.x=170.21021979434028; player.y=543.058075869948; player.angle=32.14460149860502; }//насквозь проходит


if (false) { player.x=94.77650217992577; player.y=537.4188648202588; player.angle=-32.38022094762473; }//пол экрана пропадает
if (false) { player.x=32.075341848002225; player.y=734.6982008430696; player.angle=22.990349571894782; }//назад луч не идёт

if (false) { player=JSON.parse('{"x":50.45556236904535,"y":567.921071843646,"angle":4.537856055185278,"speed":0,"rotateSpeed":0,"strifeSpeed":0}') }

//if (true) { player=JSON.parse('{"x":32.04659699937946,"y":32.100549232044365,"angle":0.7766715171374977,"speed":0,"rotateSpeed":0,"strifeSpeed":0}') }

//Пропадают красные линии
//if (true) { player=JSON.parse('{"x":46.78589910662168,"y":44.86258039014181,"angle":0.7243116395776682,"speed":0,"rotateSpeed":0,"strifeSpeed":0}') }
//

const canvas = document.createElement("canvas");
// canvas.setAttribute("width", SCREEN_WIDTH);
// canvas.setAttribute("height", SCREEN_HEIGHT);
document.body.appendChild(canvas);

const context = canvas.getContext("2d");

window.onresize = window_on_resize

window.old_wall = "x_x"

function window_on_resize()
{
  if (arduino == false)
  {
    window.SCREEN_WIDTH = window.innerWidth-4;
    window.SCREEN_HEIGHT = window.innerHeight-4;
  } else
  {
    window.SCREEN_WIDTH = 128;
    window.SCREEN_HEIGHT = 64;
  }
  canvas.setAttribute("width", SCREEN_WIDTH);
  canvas.setAttribute("height", SCREEN_HEIGHT);
}

window_on_resize()

function gameLoop(time) {
  window.walls = []
  window.distances = []
  window.jumps = []
  window.begin_time = Date.now()
  window.circles = []
  window.floor_grid = []
  clearScreen();
  
  movePlayer();
  rotatePlayer();
  strifePlayer();
  window.rays = getRays();

  if (window.beautify != true) RenderGrid()
  

  //window.rays.sort();
  //renderScene(window.rays);
  //var reversewalls = []
  //window.walls.slice().reverse().forEach((walls, i) => {
  //  reversewalls.push(walls)
  //})

  //var reversewalls = window.walls.slice().reverse()
  //renderSceneFromWalls(reversewalls)
  //canvas.flush()
  renderMinimap(0, 0, 0.75, time-window.old_time);
  
  
if (window.beautify != true)
{
  window.circles.forEach(element => {
    context.strokeStyle = element.color//"#00ff00"
    drawCircle(element.x,element.y+element.top)//кружочек
    
    context.strokeStyle = "#000000"
    context.strokeText(element.text, element.x, element.y+element.top);//номер квадранта
  });
}




  if (window.renderRaysDebug == true)
  {
    console.log("Final Rays");
    log_rays()
  }

  window.frame_count++

  
  var seconds_passed = Date.now()-window.seconds
  window.fps = Math.round(window.frame_count / seconds_passed * 1000)
  


  if (window.AnimationFrame == true) window.requestAnimationFrame(gameLoop)
  //window.old_time = time
}


if (window.renderRaysDebug == false && window.AnimationFrame == false) window.gameloop_interval = setInterval(gameLoop, TICK);
if (window.renderRaysDebug == false && window.AnimationFrame == true) window.requestAnimationFrame(gameLoop)

if (window.renderRaysDebug == true) gameLoop()

function log_rays()
{
  window.rays.forEach((ray) => {
    var wall_orientation = ((ray.vertical == false) ? "horizontal" : "vertical")
    console.log(window.rays.indexOf(ray) + ": " + ray.wall + " " + wall_orientation + " | " + ray.angle + " | " + ray.jump);
  })
}

function clearScreen() {
  context.fillStyle = ((monochrome == true) ? "black" : COLORS.ceiling);
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT/2);
  context.fillStyle = ((monochrome == true) ? "black" : COLORS.floor);
  context.fillRect(0, SCREEN_HEIGHT/2, SCREEN_WIDTH, SCREEN_HEIGHT);
}

function rend()
{
  clearScreen();
  renderLetters();
  
  //renderSceneFromWalls()
  renderMinimap(0, 0, 0.75, window.rays);
}

function renderMinimap(posX = 0, posY = 0, scale, time) {
  if (arduino == true) return
  if (window.minimapVisible == false) return
  const cellSize = scale * CELL_SIZE;
  map.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (typeof(cell)=="number" && cell!=0) {
        context.fillStyle = "grey";
        context.fillRect(
          posX + x * cellSize,
          posY + y * cellSize,
          cellSize,
          cellSize
        );
        context.beginPath();
        context.strokeStyle = "black";
        context.rect(
          posX + x * cellSize,
          posY + y * cellSize,
          cellSize,
          cellSize
        );
        context.closePath();
        context.stroke();
        
        context.fillStyle = "#00F";
        context.strokeStyle = "#000";
        // context.font = "italic 30pt Arial";
        // context.fillText(posX + " " + posY, 20, 50);
        // context.font = 'bold 30px sans-serif';
        context.font = '8px Arial';
        context.strokeText(x + "  " + y, posX + x * cellSize + cellSize/5, posY + y * cellSize + cellSize/1.5);
      } else if (typeof(cell)=="string")
      {

        
        // context.beginPath();
        // context.strokeStyle = "grey";
        // context.rect(
        //   posX + x * cellSize,
        //   posY + y * cellSize,
        //   cellSize,
        //   cellSize
        // );
        // context.closePath();
        // context.stroke();

        context.fillStyle = "#00F";
        context.strokeStyle = "#FFF";
        context.font = '12px Arial';
        context.strokeText(cell, posX + x * cellSize+ cellSize/3, posY + y * cellSize+ cellSize/1.5);
      }
    });
  });


  context.strokeStyle = COLORS.rays;
  window.rays.forEach((ray) => {
    context.beginPath();
    context.strokeStyle = "#ff9900";
    if (ray.jump == "backward") context.strokeStyle = "#0000ff";
    context.moveTo(player.x * scale, player.y * scale);
    context.lineTo(
      (player.x + Math.cos(ray.angle) * ray.distance) * scale,
      (player.y + Math.sin(ray.angle) * ray.distance) * scale
    );
    context.closePath();
    context.stroke();
  });




  context.fillStyle = "blue";
  context.fillRect(
    posX + player.x * scale - 10 / 2,
    posY + player.y * scale - 10 / 2,
    10,
    10
  );

  context.strokeStyle = "blue";
  context.beginPath();
  context.moveTo(player.x * scale, player.y * scale);
  context.lineTo(
    (player.x + Math.cos(player.angle) * 20) * scale,
    (player.y + Math.sin(player.angle) * 20) * scale
  );
  context.closePath();
  context.stroke();

  context.fillStyle = "#00F";
  context.strokeStyle = "#FFF";
  context.font = '12px Arial';
  context.strokeText(window.cast_ray_count + " rays", map[0].length * cellSize, cellSize*0.5);
  context.strokeText(Date.now()-window.begin_time + " msec", map[0].length * cellSize, cellSize*1);
  context.strokeText(window.leftest_wall_index, map[0].length * cellSize, cellSize*1.5);
  
  context.strokeText(window.jumps.length, map[0].length * cellSize, cellSize*2);


  context.strokeText("H distance " + getHCollision(player.angle).distance, map[0].length * cellSize, cellSize*2.5);
  context.strokeText("V distance " + getVCollision(player.angle).distance, map[0].length * cellSize, cellSize*3);
  
  context.strokeText("FPS " + window.fps, map[0].length * cellSize, cellSize*3.5);
  //context.strokeText("Seconds Count " + , map[0].length * cellSize, cellSize*4);

  var last_line_y = 4
  window.drawn_grid_lines.forEach(element => {
    context.strokeText("drawn_grid_line: " + element, map[0].length * cellSize, cellSize*last_line_y);
    last_line_y += 0.5
  });
  //console.log(window.drawn_grid_lines)
  //debugger

}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function toDegrees(radians)
{
  return (radians * 180) / Math.PI
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function outOfMapBounds(x, y) {
  return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}



function getVCollision(angle) {
  const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);

  const firstX = right
    ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE //0 - x of right side of player's cell
    : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;//1 - x of left side of player's cell
  const firstY = player.y + (firstX - player.x) * Math.tan(angle);

  const xA = right ? CELL_SIZE : -CELL_SIZE;//x movement untill next square
  const yA = xA * Math.tan(angle);//y movement untill next square

  let wall;
  let wall_x;
  let wall_y;
  let nextX = firstX;
  let nextY = firstY;

  while (!wall) {
    const cellX = right
      ? Math.floor(nextX / CELL_SIZE)
      : Math.floor(nextX / CELL_SIZE) - 1;
    const cellY = Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }
    wall = map[cellY][cellX];
    if (typeof(wall)=="string")
    {
      wall = 0
      
      //if (window.texturesV.indexOf(cellX + " " + cellY)==-1) window.texturesV.push(cellX + " " + cellY)
    }
    wall_x=cellX
    wall_y=cellY

    if (wall==0) {
      nextX += xA;
      nextY += yA;
    }
  }
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: true,
    wall: wall_x + " " + wall_y,
    ray_end: nextX  + "," + nextY,
    color: wall
  };
}




function getHCollision(angle) {
  const up = Math.abs(Math.floor(angle / Math.PI) % 2);

  const firstY = up
    ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
    : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
  const firstX = player.x + (firstY - player.y) / Math.tan(angle);

  const yA = up ? -CELL_SIZE : CELL_SIZE;
  const xA = yA / Math.tan(angle);

  let wall;
  let wall_x;
  let wall_y;

  let nextX = firstX;
  let nextY = firstY;
  while (!wall) {
    const cellX = Math.floor(nextX / CELL_SIZE);
    const cellY = up ? Math.floor(nextY / CELL_SIZE) - 1 : Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }

    wall = map[cellY][cellX];
    if (typeof(wall)=="string")
    {
      wall = 0
      if (window.texturesH.indexOf(cellX + " " + cellY)==-1) window.texturesH.push(cellX + " " + cellY)
    }
    wall_x=cellX
    wall_y=cellY

    if (wall==0) {
      nextX += xA;
      nextY += yA;
    }
  }

  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),//длинна гипотенузы
    vertical: false,
    wall: wall_x + " " + wall_y,
    ray_end: nextX  + "," + nextY,
    color: wall
  };
}


  function castRay2(angle, i, target_wall, old_right_side) {

  // if (window.target_wall_debug==true && i==1676 && target_wall=='1 9')
  // {
  //   renderMinimap(0, 0, 0.75, 0);
  //   debugger
  // } 
  var vc = getVCollisionNext(angle)
  var hc = getHCollisionNext(angle)
  var vhc;
  
  while (true) {
    if (vc.wall_x == undefined && vc.wall_y == undefined && hc.wall_x == undefined && hc.wall_y == undefined)
    {
      /*alert("red lines are gone");*/
      renderMinimap(0, 0, 0.75, 0);
      console.log("castRay2 missed"); debugger;
      break
    }

    if (
      (typeof(target_wall) == 'undefined' && (vc.map_cell != 0 || typeof(vc.map_cell) == 'undefined') && vc.distance<=hc.distance)
      ||
      (typeof(target_wall) != 'undefined' && vc.wall_x + " " + vc.wall_y == target_wall && vc.distance<=hc.distance)
      )
    {
      vhc=vc;
      break;
    }
    else if (
      (typeof(target_wall) == 'undefined' && (hc.map_cell != 0 || typeof(hc.map_cell) == 'undefined') && hc.distance<=vc.distance)
      ||
      (typeof(target_wall) != 'undefined' && hc.wall_x + " " + hc.wall_y == target_wall && hc.distance<=vc.distance)
      )
    {
      vhc=hc;
      break;
    }

    if (vc.distance<=hc.distance)
    {
      vhc=vc;
      if (typeof(target_wall) == 'undefined')
      {
        var ray = {
          angle: vhc.angle,
          distance: vhc.distance,
          vertical: vhc.vertical,
          wall: vhc.wall_x + " " + vhc.wall_y,
          ray_end: vhc.nextX  + "," + vhc.nextY,
          color: vhc.color
        };

        var wall_name = ray.wall + ((ray.vertical == true) ? ' v' : ' h')
        //if (window.slowmotion == true) { RenderRay3D(ray, i);  }
        
        if (window.drawn_grid_lines.indexOf(wall_name)==-1 || Math.round(i)==0 || Math.round(i)==SCREEN_WIDTH + 1) 
        {
          window.drawn_grid_lines.push(wall_name)
          //if (window.drawn_grid_lines.indexOf("5 5 v")!=-1) {alert("alert!");debugger;}
          if (typeof(old_right_side) == 'object' && old_right_side == null)
          {
              var draw_full_line = true;
          } else
          {
            y_from_old_ray = SCREEN_HEIGHT / 2 + old_right_side.wall_height / 2 //x:right_i,wall_height:right_height, angle:angle_right
            y_from_new_ray = SCREEN_HEIGHT / 2 + getwallHeight(fixFishEye(ray.distance, ray.angle, player.angle)) / 2
            var draw_full_line = (y_from_new_ray - y_from_old_ray > 1)
          }

          getGridLineUsingRayIntersection(ray, i, draw_full_line)//Горизонтальные линии сетки на полу. Находит "стену" то есть полоску на полу по одной точке, то есть по лучу и рисует её всю
          
          if (window.slowmotion == true) { renderMinimap(0, 0, 0.75, window.rays); debugger }

        }

        
        
      }

      vc_nextX = vc.nextX
      vc_nextY = vc.nextY
      vc = getVCollisionNext(angle, vc.nextX, vc.nextY)
      if (vc.nextX==vc_nextX && vc_nextY==vc.nextY) debugger
      continue;
    }

    if (hc.distance<=vc.distance)
    {
      vhc=hc;
      if (typeof(target_wall) == 'undefined')
      {
        var ray = {
          angle: vhc.angle,
          distance: vhc.distance,
          vertical: vhc.vertical,
          wall: vhc.wall_x + " " + vhc.wall_y,
          ray_end: vhc.nextX  + "," + vhc.nextY,
          color: vhc.color
        };
        
        var wall_name = ray.wall + ((ray.vertical == true) ? ' v' : ' h')

        //if (window.slowmotion == true) RenderRay3D(ray, i)
        
        if (window.drawn_grid_lines.indexOf(wall_name)==-1 || Math.round(i)==0 || Math.round(i)==SCREEN_WIDTH + 1) 
        {
          window.drawn_grid_lines.push(wall_name)

            
          if (typeof(old_right_side) == 'object' && old_right_side == null)
          {
            var draw_full_line = true;
          } else
          {
            y_from_old_ray = SCREEN_HEIGHT / 2 + old_right_side.wall_height / 2
            y_from_new_ray = SCREEN_HEIGHT / 2 + getwallHeight(fixFishEye(ray.distance, ray.angle, player.angle)) / 2
            var draw_full_line = (y_from_new_ray - y_from_old_ray > 1);
          }

          
          //Когда линия сетки рисуется при полёте в следующий пиксель после рэйскипнутой стенки то по дороге к стенке обнаруживаются линии на полу
          //тогда если левый конец обнаруженной линии по оси y почти совпадает с игреком правого края рэйскипнутой стенки значит линию можно нарисовать от текущего i
          //если левый край линии на полу выше нижнего края стенки значит стенка перекрывает этот луч и линию надо тоже нарисовать обрезанную по i
          //если левый крац линии на полу ниже нижнего края стенки значит она не перекрывает этот луч и его надо нарисовать целиком
          getGridLineUsingRayIntersection(ray, i, draw_full_line)//Вертикальные линии сетки на полу
          if (window.slowmotion == true) { renderMinimap(0, 0, 0.75, window.rays); debugger }

        }

        
        
      }

      hc_nextX = hc.nextX
      hc_nextY = hc.nextY
      hc = getHCollisionNext(angle, hc.nextX, hc.nextY)
      if (hc.nextX==hc_nextX && hc_nextY==hc.nextY) debugger
      continue;
    }


  } //вмето goto! написал break где захочешь и он тебе вышел

  return {
    angle: vhc.angle,
    distance: vhc.distance,
    vertical: vhc.vertical,
    wall: vhc.wall_x + " " + vhc.wall_y,
    ray_end: vhc.nextX  + "," + vhc.nextY,
    color: vhc.color
  };
  
}



function getVCollisionNext(angle, nextX, nextY) {

  let wall;
  let wall_x;
  let wall_y;
  //let color;

  do {

    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);
    if (typeof(nextX)=='undefined' &&  typeof(nextY)=='undefined')
    {
      nextX = right
      ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE //при right=0 - координата x правой сторны клетки в которой находится player
      : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;//при right=1 - x левой стороны клетки в которой находится player
      nextY = player.y + (nextX - player.x) * Math.tan(angle);
    } else
    {
      const xA = right ? CELL_SIZE : -CELL_SIZE;//x movement untill next square
      const yA = xA * Math.tan(angle);//y movement untill next square

      nextX += xA;
      nextY += yA;
    }

    const cellX = right ? Math.floor(nextX / CELL_SIZE) : Math.floor(nextX / CELL_SIZE) - 1;
    const cellY = Math.floor(nextY / CELL_SIZE);

    if (outOfMapBounds(cellX, cellY)) {
      break;
    }

    wall = map[cellY][cellX];
    
    if (typeof(wall)=="string")
    {
      wall = 0;
    }

    wall_x=cellX
    wall_y=cellY
    
  } while (false);//вмето goto! написал break где захочешь и он тебе вышел

  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: true,
    wall_x: wall_x,
    wall_y: wall_y,
    map_cell: wall,
    nextX: nextX,
    nextY: nextY,
    color: wall
  };
}


function getHCollisionNext(angle, nextX, nextY) {

  let wall;
  let wall_x;
  let wall_y;
  

  do {

    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    if (typeof(nextX)=='undefined' &&  typeof(nextY)=='undefined')
    {
      nextY = up ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
      nextX = player.x + (nextY - player.y) / Math.tan(angle);
    }
    else
    {
      const yA = up ? -CELL_SIZE : CELL_SIZE;
      const xA = yA / Math.tan(angle);

      nextX += xA;
      nextY += yA;
    }

    const cellX = Math.floor(nextX / CELL_SIZE);
    const cellY = up  ? Math.floor(nextY / CELL_SIZE) - 1 : Math.floor(nextY / CELL_SIZE);
    
    if (outOfMapBounds(cellX, cellY)) {
      break;
    }

    wall = map[cellY][cellX];
    
    if (typeof(wall)=="string") 
    {
     
      wall = 0;
    }
    

    wall_x=cellX
    wall_y=cellY

  } while (false);//вмето goto! написал break где захочешь и он тебе вышел
  
  return {
    angle,
    distance: distance(player.x, player.y, nextX, nextY),
    vertical: false,
    wall_x: wall_x,
    wall_y: wall_y,
    map_cell: wall,
    nextX: nextX,
    nextY: nextY,
    color: wall
  };

}




function castRay(angle) {
  window.texturesV = []
  window.texturesH = []
  const vCollision = getVCollision(angle);
  const hCollision = getHCollision(angle);

  //var hvc = getHVCollision(angle);

  //return hvc;

  return hCollision.distance >= vCollision.distance ? vCollision : hCollision;
}



function fixFishEye(distance, angle, playerAngle) {
  const diff = angle - playerAngle;
  return distance * Math.cos(diff);
}

//чтобы не пускать луч в каждый пиксель стены делается прыжок до правого края этой стены если проход идёт вперёд или, если луч наскочил на более близкую стену, проход запускается в обратную сторону, перескакивая на левую сторону стены, пока не встретится блок с которого луч перескочил на более ближнее препятствие
function ray_skipper(direction, close_far_ray_movement, forward_jump_occured, i, ray)
{
  if (forward_jump_occured)//Это нужно чтобы правильно лучи в minimap рисовались
  {
    if (window.slowmotion == true) { renderMinimap(0, 0, 0.75, window.rays); debugger }
    //После прыжка на ближнюю загораживающую стену нужно удалить предыдущий перемотанный до угла стенки луч,
    //потому что этот угол загорожен ближней загораживающей стенкой
    if (window.renderRaysDebug == true) { console.log(window.skip_ray_i_before_jump + " deleted, going back to " + window.rays[window.skip_ray_i_before_jump].wall);/*debugger*/} 
    delete window.rays[window.skip_ray_i_before_jump]
  }
   
    
  //var i0=i
  var i0 = angle_diff(corr(initialAngle),corr(ray.angle));
  //i = (ray.angle - initialAngle) / angleStep
  //if (i0!=i) console.log("i: " + i + " i0: " + i0)
  
  var left_i
  var left_height
  var left_distance
  
  var right_i
  var right_height
  var right_distance

  //координаты в массиве карты
  var wall_x = parseInt(ray.wall.split(" ")[0])
  var wall_y = parseInt(ray.wall.split(" ")[1])

  var wall_orientation = ((ray.vertical == false) ? "horizontal" : "vertical")

  //ray_end_x и ray_end_y - это координаты на двухмерной плоскости карты (куда луч уткнулся) (аналогичено player.x и player.y)
  
  if (wall_orientation == "horizontal")
  {
    var ray_end_y = ray.ray_end.split(",")[1]
    if (ray_end_y<=player.y)//(wall_y<=player_cell_y)
    {
        
        var wall_right_border_x = (wall_x + 1) * CELL_SIZE
        var wall_right_border_y = (wall_y + 1) * CELL_SIZE
        var wall_left_border_x = (wall_x) * CELL_SIZE
        var wall_left_border_y = (wall_y + 1) * CELL_SIZE
        var right_x_y = [wall_x + 1, wall_y + 1]
        var left_x_y = [wall_x, wall_y + 1]
    } else
    {
        var wall_right_border_x = (wall_x) * CELL_SIZE
        var wall_right_border_y = (wall_y) * CELL_SIZE 
        var wall_left_border_x = (wall_x + 1) * CELL_SIZE
        var wall_left_border_y = (wall_y) * CELL_SIZE
        var right_x_y = [wall_x, wall_y]
        var left_x_y = [wall_x + 1, wall_y]
    }

    //console.log(wall_right_border_x  + " " + wall_right_border_y + " / " + wall_orientation)
    //debugger
  } else//if (wall_orientation == "vertical")
  {
    var ray_end_x = ray.ray_end.split(",")[0]
    if (ray_end_x<=player.x)//(wall_x<=player_cell_x)
    {
        var wall_right_border_x = (wall_x + 1) * CELL_SIZE
        var wall_right_border_y = (wall_y) * CELL_SIZE
        var wall_left_border_x = (wall_x + 1) * CELL_SIZE
        var wall_left_border_y = (wall_y + 1) * CELL_SIZE
        var right_x_y = [wall_x + 1, wall_y]
        var left_x_y = [wall_x + 1, wall_y + 1]
    } else
    {
        var wall_right_border_x = (wall_x) * CELL_SIZE
        var wall_right_border_y = (wall_y + 1) * CELL_SIZE
        var wall_left_border_x = (wall_x) * CELL_SIZE
        var wall_left_border_y = (wall_y) * CELL_SIZE
        var right_x_y = [wall_x, wall_y + 1]
        var left_x_y = [wall_x, wall_y]
    }
  }


 
  var ray_i = i
  var ray_distance = ray.distance
  if ( (typeof(bss)=='undefined' || bss == false) && direction == "backward")
  {
    wall_right_side = {x:ray_i+1,wall_height:getwallHeight(fixFishEye(ray_distance, ray.angle, player.angle))}
  } else
  {
    var angle_right = Math.atan2(wall_right_border_y - player.y, wall_right_border_x - player.x) //* 180 / Math.PI;

    
    var i_change_right = angle_diff(corr(angle_right),corr(ray.angle));
    
    right_i = ray_i + i_change_right
    
    
    //debugger
    if (direction == "forward") {i = right_i; if (i_change_right == 0) { i ++ }}

    right_distance = distance(player.x, player.y, wall_right_border_x, wall_right_border_y)

    if (right_i>window.SCREEN_WIDTH)//Система выпрямления стен уходящих за экран. Смысл в том чтобы стена рисуется не до края, который ушёл за экран, а до луча который утыкивается в край экрана. При текстурировании конечно будет искажение текстуры, но может быть можно как-то спроецировать заэкранную сторону стены через краеэкранную сторону, тогда и текстура будет ровная и стена сама тоже.
    {
      //нужно вычислить wall_x, wall_y(аналог player.x,y) без castRay2 и distance. 
      //i и angle у нас уже есть
      
      window.last_ray = castRay2(player.angle + FOV / 2, numberOfRays, ray.wall)//window.rays[window.rays.length-1]
      //window.last_ray = window.rays[window.rays.length-1]
      if (ray.wall == last_ray.wall)
      {
        
        right_i = window.SCREEN_WIDTH //window.rays.length-1
        // if (window.rays.length-1 != window.SCREEN_WIDTH) 
        // {
        //   console.log("window.rays.length-1")
        //   console.log(window.rays.length-1)
        //   console.log("window.SCREEN_WIDTH-1")
        //   console.log(window.SCREEN_WIDTH-1)
        // }

        i = right_i
        angle_right = last_ray.angle
        right_distance = last_ray.distance
        if (window.walls_changed == true)/*сработает только если на экране что-то переместилось*/ console.log(last_ray)
      }
    }

    right_distance1 = fixFishEye(right_distance, angle_right, player.angle);
    right_height = getwallHeight(right_distance1)
    var wall_right_side = {x:right_i,wall_height:right_height}//Вот тут height становится слишком большим
  }

  if (direction == "forward" && close_far_ray_movement == "far")
  {
    wall_left_side = {x:ray_i-1,wall_height:getwallHeight(fixFishEye(ray_distance, ray.angle, player.angle))}
  } else
  {
    var angle_left = Math.atan2(wall_left_border_y - player.y, wall_left_border_x - player.x) //* 180 / Math.PI;

    var i_change_left = angle_diff(corr(angle_left),corr(ray.angle));

    left_i = ray_i - i_change_left

    if (direction == "backward") {i = left_i; if (i_change_left == 0) { i -- }}

    left_distance = distance(player.x, player.y, wall_left_border_x, wall_left_border_y)

    if (left_i<0)//Система выпрямления стен уходящих за экран. Смысл в том чтобы стена рисуется не до края, который ушёл за экран, а до луча который утыкивается в край экрана. При текстурировании конечно будет искажение текстуры, но может быть можно как-то спроецировать заэкранную сторону стены через краеэкранную сторону, тогда и текстура будет ровная и стена сама тоже.
    {
      var first_ray = window.rays[0]
      left_i = 0
      i = 0
      angle_left = first_ray.angle
      left_distance = first_ray.distance
    }

    left_distance1 = fixFishEye(left_distance, angle_left, player.angle);
    left_height = getwallHeight(left_distance1)
    var wall_left_side = {x:left_i,wall_height:left_height}//Вот тут height становится слишком большим
  }

  //if (typeof(window.wall_ies) == 'undefined') window.wall_ies=[]
  //window.wall_ies.push(wall_i)
  //if (wall_i==2518) debugger

  var clr = decode_argb(ray.color)
  var hex_color = "#"+(clr.r).toString(16)+(clr.g).toString(16)+(clr.b).toString(16)+"99"
  var hex_color = "rgba("+clr.r+","+clr.g+","+clr.b+","+"0.5)"
  var hex_color = "rgb("+clr.r+","+clr.g+","+clr.b+")"

  //window.walls[wall_i].push({left_side:wall_left_side,right_side:wall_right_side,color:hex_color})
  
  if ((typeof(window.backward_scan_started)=='undefined' || window.backward_scan_started == false))
  {
    if (right_i > numberOfRays) { /*alert('right_i > numberOfRays');*/ debugger; }
    renderWall({left_side:wall_left_side,right_side:wall_right_side,color:hex_color}, left_x_y, right_x_y)//ray.wall + ' ' + ((ray.vertical == true) ? 'v' : 'h')


    window.right_side_from_skipper = wall_right_side
    RenderRay3D2({left_side:wall_left_side,right_side:wall_right_side,color:hex_color})
    if (window.slowmotion == true) { renderMinimap(0, 0, 0.75, window.rays); debugger }
  }
   
  
  

  //debugger
  window.backward_scan_started = false
  
  if (window.renderRaysDebug == true) console.log("ray_skipper "+direction+" i:" + i + " (" + ((direction == "forward") ? "+" : "-") + i_change_right + ")")
  
  var skip_skip_ray = false
  if (look_direction == "forward" && i>=numberOfRays) skip_skip_ray = true
  if (look_direction == "backward" && i<=0) skip_skip_ray = true

  if (skip_skip_ray == false)
  {
    var skip_ray = {
      angle: ((direction == "forward") ? angle_right : angle_left),
      distance: ((direction == "forward") ? right_distance : left_distance),//длинна гипотенузы
      vertical: false,
      wall: wall_x + " " + wall_y,
      jump: direction,//(((direction == "backward")) ? "backward" : "forward")
      color: ray.color
    };

    if (typeof(window.rays[i]) != "undefined")
    {
      if (direction == "backward") i=i+0.1
      if (direction == "forward") i=i-0.1
      if (window.renderRaysDebug == true) { console.log("in ray_skipper i not changed:" + i); debugger}
      //debugger
    }

    //window.rays[i] = skip_ray
    
    //window.walls

    if (renderRaysDebug) 
    {
      clearScreen();
      renderMinimap(0, 0, 0.75, window.rays);
      console.log(i + ": " + skip_ray.wall + " end:" + skip_ray.ray_end + " " + wall_orientation + " | " + skip_ray.angle + " | " + (skip_ray.angle * (180 / Math.PI)) + " | " + skip_ray.jump);
      window.renderRayDebugCurRay++
      if (window.renderRayDebugCurRay>=window.renderRayDebugStartingRay && renderRaysDebug_Debugger==true) debugger
    }
    window.skip_ray_i_before_jump=i //Это нужно чтобы правильно лучи в minimap рисовались
  }
  
  return i

}

function corr(radian_angle)
{
  if (radian_angle > Math.PI)
  {
    radian_angle -= 2*Math.PI
  } else if (radian_angle < -Math.PI)
  {
    radian_angle += 2*Math.PI
  }
  return radian_angle
}

// function corr(p_angle)//player.angle может расти безразмерно в плюс или в минус, эта функция загоняет его в промежуток между -3.1415 и +3.1415
// {
//   var player_angle_sign = (((p_angle+"").indexOf("-")==-1) ? 1 : -1)
//   var corr1 = ((p_angle % (Math.PI*2))-(Math.PI* player_angle_sign)) * player_angle_sign
//   var corr1_sign = (((corr1+"").indexOf("-")==-1) ? 1 : -1)
//   if (corr1_sign == 1)
//   {
//     p_angle = ((Math.PI) - corr1)*player_angle_sign*(corr1_sign*-1)
//   } else
//   {
//     p_angle = ((Math.PI) + corr1)*player_angle_sign*(corr1_sign*-1)
//   }
  
//   //console.log(p_angle + " " + player_angle_sign + " " + corr1 + " " + corr2)
//   return p_angle
// }

function angle_diff(ang1, ang2)
{
  var ang1sign = ((ang1+"").indexOf("-")=="-1" ? "+" : "-")
  var ang2sign = ((ang2+"").indexOf("-")=="-1" ? "+" : "-")

  if (ang1sign != ang2sign && Math.round(Math.abs(ang1))>=2)
  {
    return Math.round(((Math.PI - Math.abs(ang1)) + (Math.PI - Math.abs(ang2)))/angleStep)
  } else
  {
    return Math.round(Math.abs(ang1 - ang2)/angleStep)
  }
}








function getRays() {
  window.drawn_grid_lines = []
  window.initialAngle = corr(player.angle - FOV / 2);
  
  window.numberOfRays = SCREEN_WIDTH/v_step;
  window.angleStep = FOV / window.numberOfRays;

  window.initialRay = castRay2(window.initialAngle, 0, undefined, {wall_height: SCREEN_HEIGHT})
  //window.lastRay = castRay2(corr(player.angle + FOV / 2), SCREEN_WIDTH)

  
  
  window.finalAngle = window.initialAngle + window.numberOfRays * angleStep
  //console.log(((initialAngle * 180 / Math.PI)+180) + " " + ((finalAngle * 180 / Math.PI)+180) )

  window.clins = []
  
  var angle = window.initialAngle
  window.rays = []
  look_direction = "forward"
  
  if (look_direction == "forward") window.i = 0
  if (look_direction == "backward") window.i = window.numberOfRays//(finalAngle-initialAngle)/angleStep
  
  window.backward_steps = 0
  angle=window.finalAngle
  
  if (look_direction == "backward") window.rays[(0).toString()] = castRay(window.initialAngle);
  if (look_direction == "forward") window.rays[(window.numberOfRays).toString()] = castRay(window.finalAngle);
  window.cast_ray_count = 0
  window.final_jump=false


  //window.slowmotion = true
  var final_i = scanWalls(0,"forward")
  //console.log(final_i)
  //debugger
  for (let i = 0; i < window.jumps.length; i++) {
    window.i_during_jump = window.jumps[i].i_during_jump;
    window.i_before_jump = window.jumps[i].i_before_jump
    //window.ray_during_jump = window.jumps[i].ray_during_jump
    window.wall_before_jump = window.jumps[i].wall_before_jump
    window.wrong_ray_i=window.jumps[i].skip_ray_i_before_jump
    window.backward_scan_started = true
    scanWalls(window.i_during_jump,"backward")
    //break
  }

  window.slowmotion = false

  // var backward_i = scanWalls(forward_i,"backward")
  // console.log("scanWalls - " + backward_i)
  // var forward_i = scanWalls(forward_i,"forward")
  // console.log("scanWalls - " + forward_i)
  //});

  // window.clins.forEach(element => {
  //   rays[element].clin = true
  // });
  //rays.sort()
  return rays
}


 


//Линии на полу
function getGridLineUsingRayIntersection(ray, i, draw_full_line)
{
  if (i>SCREEN_WIDTH) return
  var super_first_i = i;
    
  if (window.slowmotion == true) { renderMinimap(0, 0, 0.75, window.rays); debugger }

  //debugger
  var wall_x = parseInt(ray.wall.split(" ")[0])
  var wall_y = parseInt(ray.wall.split(" ")[1])

  var wall_orientation = ((ray.vertical == false) ? "horizontal" : "vertical")

  //i = (ray.angle - initialAngle)/angleStep;
  
  if (wall_orientation == "horizontal")
  {
    var ray_end_y = ray.ray_end.split(",")[1]
    if (ray_end_y<=player.y)//(wall_y<=player_cell_y)
    {
        var wall_right_border_x = (wall_x + 1) * CELL_SIZE
        var wall_right_border_y = (wall_y + 1) * CELL_SIZE
        var wall_left_border_x = (wall_x) * CELL_SIZE
        var wall_left_border_y = (wall_y + 1) * CELL_SIZE
    } else
    {
        var wall_right_border_x = (wall_x) * CELL_SIZE
        var wall_right_border_y = (wall_y) * CELL_SIZE 
        var wall_left_border_x = (wall_x + 1) * CELL_SIZE
        var wall_left_border_y = (wall_y) * CELL_SIZE
    }

    //console.log(wall_right_border_x  + " " + wall_right_border_y + " / " + wall_orientation)
    //debugger
  } else//if (wall_orientation == "vertical")
  {
    var ray_end_x = ray.ray_end.split(",")[0]
    if (ray_end_x<=player.x)//(wall_x<=player_cell_x)
    {
        var wall_right_border_x = (wall_x + 1) * CELL_SIZE
        var wall_right_border_y = (wall_y) * CELL_SIZE
        var wall_left_border_x = (wall_x + 1) * CELL_SIZE
        var wall_left_border_y = (wall_y + 1) * CELL_SIZE
    } else
    {
        var wall_right_border_x = (wall_x) * CELL_SIZE
        var wall_right_border_y = (wall_y + 1) * CELL_SIZE
        var wall_left_border_x = (wall_x) * CELL_SIZE
        var wall_left_border_y = (wall_y) * CELL_SIZE
    }
  }


  var ray_i = Math.round(i)
  var ray_distance = ray.distance


  var angle_right = Math.atan2(wall_right_border_y - player.y, wall_right_border_x - player.x) //* 180 / Math.PI;

  var ar_deg = toDegrees(angle_right)
  var ray_deg = toDegrees(ray.angle)
  
  var i_change_right = angle_diff(corr(angle_right),corr(ray.angle));
  
  var i_change_right2 = Math.round(corr(angle_right-ray.angle)/angleStep)
  // if (i_change_right != i_change_right2)
  // {
  //   console.log(angle_right + " : " + ar_deg)
  //   console.log(ray.angle + " : " + ray_deg)
    
  //   debugger
  // }
  
  right_i = ray_i + i_change_right
  right_distance = distance(player.x, player.y, wall_right_border_x, wall_right_border_y)
  var color = "#009900"

  if (right_i > window.SCREEN_WIDTH)
  {
    // if (window.target_wall_debug==true && player.angle + FOV / 2==1.496619833585159 && ray.wall=='1 9')
    // {
    //   renderMinimap(0, 0, 0.75, 0); //window.target_wall_debug=true;player=JSON.parse('{"x":46.036222364160196,"y":44.200778900204966,"angle":0.7112216701877108,"speed":0,"rotateSpeed":0,"strifeSpeed":0}')
    //   debugger
    // } 
    var last_ray = castRay2(player.angle + FOV / 2, numberOfRays, ray.wall)
    if (ray.wall == last_ray.wall)
    {
      
      right_i = window.SCREEN_WIDTH //window.rays.length-1//window.SCREEN_WIDTH
      i = right_i
      
      angle_right = last_ray.angle
      right_distance = last_ray.distance
      color = "#990000"
      if (window.walls_changed == true)/*сработает только если на экране что-то переместилось*/ console.log(last_ray)
    } else
    {
      //alert('!!');debugger
    }
  }

  // if (ray_i==SCREEN_WIDTH)
  // {
  //   right_i = ray_i//window.SCREEN_WIDTH
  //   angle_right = ray.angle
  //   right_distance = ray.distance
  //   color = "#990000"
  // }




  // if (ray_i + i_change_right > window.SCREEN_WIDTH)
  // {
  //   var i_overflow = (ray_i + i_change_right) - window.SCREEN_WIDTH
  //   var right_angle_corrected = angle_right - (i_overflow * angleStep)
  //   if (ray.vertical == true)
  //   {

  //     const right = Math.abs(Math.floor((right_angle_corrected - Math.PI / 2) / Math.PI) % 2);
  //     firstX = right
  //     ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE //при right=0 - координата x правой сторны клетки в которой находится player
  //     : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;//при right=1 - x левой стороны клетки в которой находится player
  //     firstY = player.y + (firstX - player.x) * Math.tan(right_angle_corrected);
      
  //     const player_cellX = right ? Math.floor(firstX / CELL_SIZE) : Math.floor(firstX / CELL_SIZE) - 1;
  //     const ray_cellX = ray.wall.split(" ")[0]

  //     var cell_number_between_player_and_overflowing_wall = ray_cellX - player_cellX
      
  //     const xA = right ? cell_number_between_player_and_overflowing_wall : -cell_number_between_player_and_overflowing_wall;//x movement untill next square
  //     const yA = xA * Math.tan(right_angle_corrected);//y movement untill next square

  //     nextX = firstX + xA;
  //     nextY = firstY + yA;
  //     right_i=window.SCREEN_WIDTH
  //     right_distance = distance(player.x, player.y, nextX, nextY)
  //   }
  // }


  
  var ray_i2 = Math.round(corr(ray.angle - window.initialAngle) / angleStep)

  if (ray_i != ray_i2 && (right_i<=window.SCREEN_WIDTH)) debugger


  //var i_by_angle_right = (Math.abs(initialAngle) + corr(angle_right)) / angleStep
  //right_i = angle_diff(corr(initialAngle),corr(angle_right));
  //if (right_i0 != right_i) debugger

  
  //if (direction == "forward") {i = right_i; if (i_change_right == 0) { i ++ }}

  

  // if (right_i>window.SCREEN_WIDTH)//Система выпрямления стен уходящих за экран. Смысл в том чтобы стена рисуется не до края, который ушёл за экран, а до луча который утыкивается в край экрана. При текстурировании конечно будет искажение текстуры, но может быть можно как-то спроецировать заэкранную сторону стены через краеэкранную сторону, тогда и текстура будет ровная и стена сама тоже.
  // {
  //   var last_ray = window.rays[window.rays.length-1]
  //   if (ray.wall == last_ray.wall)
  //   {
  //     right_i = window.rays.length-1//window.SCREEN_WIDTH
  //     angle_right = last_ray.angle
  //     right_distance = last_ray.distance
  //     if (window.walls_changed == true)/*сработает только если на экране что-то переместилось*/ console.log(last_ray)
  //   }
  // }

  right_distance1 = fixFishEye(right_distance, angle_right, player.angle);
  right_height = getwallHeight(right_distance1)
  var wall_right_side = {x:right_i,wall_height:right_height}//Вот тут height становится слишком большим



  var angle_left = Math.atan2(wall_left_border_y - player.y, wall_left_border_x - player.x) //* 180 / Math.PI;

  var i_change_left = angle_diff(corr(angle_left),corr(ray.angle));

  left_i = ray_i - i_change_left

  //left_i = angle_diff(corr(initialAngle),corr(angle_left));
  
  //if (direction == "backward") {i = left_i; if (i_change_left == 0) { i -- }}

  left_distance = distance(player.x, player.y, wall_left_border_x, wall_left_border_y)

  if (ray_i == 0)
  {
    left_i = 0
    angle_left = ray.angle
    left_distance = ray.distance
    color = "#000099"
  }

  // if (left_i<0 && ray_i == 0)//Система выпрямления стен уходящих за экран. Смысл в том чтобы стена рисуется не до края, который ушёл за экран, а до луча который утыкивается в край экрана. При текстурировании конечно будет искажение текстуры, но может быть можно как-то спроецировать заэкранную сторону стены через краеэкранную сторону, тогда и текстура будет ровная и стена сама тоже.
  // {
  //   //render_floor_grid = true
  //   var first_ray = ((window.rays[0]) ? window.rays[0] : ray)
  //   left_i = 0
  //   angle_left = first_ray.angle
  //   left_distance = first_ray.distance
  // }

  left_distance1 = fixFishEye(left_distance, angle_left, player.angle);
  left_height = getwallHeight(left_distance1)
  var wall_left_side = {x:left_i,wall_height:left_height}//Вот тут height становится слишком большим
  //i = (ray.angle - initialAngle)/angleStep;

  

  RenderRay3D(ray,ray_i)//кружочки с номером квадранта
  if (wall_right_side.x>SCREEN_WIDTH+1 && i!=SCREEN_WIDTH + 1)
  {

  } else
  {
    
    if (i == wall_left_side.x || i == wall_left_side.x+1 || color == "#990000")
    {
      if (window.beautify == true) color = "#000000"

      RenderGridSide({ wall_left_side:wall_left_side, wall_right_side:wall_right_side }, color, ray.wall)//линии обрезанные экраном справа (красные)


    } else
    {

      if (draw_full_line == true)
      {

        if (window.beautify == true) 
        {
          color = "#000000"
        } else
        {
          color = "#000000"
        }
          

        RenderGridSide({ wall_left_side:wall_left_side, wall_right_side:wall_right_side }, color)//недорезанные линии которые надо целиком рисовать
      } else
      {
        var ray_distance1 = fixFishEye(ray.distance, ray.angle, player.angle);
        var ray_distance = getwallHeight(ray_distance1)
  
        if (window.beautify == true) color = "#000000"

        RenderGridSide({ wall_left_side:{x:i,wall_height:ray_distance}, wall_right_side:wall_right_side }, color)
      }
    }
    
    


  }

  //renderMinimap(0, 0, 0.75, window.rays)
  var pips = 0
  

  
  
  //debugger
}



//Это задумывалось как лучи на полу, но что-то они совсем непонятные честно, поэтому рисую с её помощью кружочки с номером квадранта
function RenderRay3D(ray,ray_i)
{
  if (window.beautify == true) { return }
  // var player_distance = 1//поставить игрока на один уровень с линией квадрата, который слева и написать findFirstNonNullArgument(window.rays) - там будет этот distance
  // var player_wall_height_aka_y_3D = getwallHeight(player_distance)
  // var player_i_aka_x_3D = SCREEN_WIDTH/2
  // var player_ray_start = {x:player_i_aka_x_3D,wall_height:player_wall_height_aka_y_3D}
  
  // var grid_ray_height_aka_y_3D = getwallHeight(ray.distance)
  // var grid_ray_i_aka_x_3D = ray_i
  // var grid_ray_end = {x:grid_ray_i_aka_x_3D,wall_height:grid_ray_height_aka_y_3D};

  // var left_s = player_ray_start.x
  // var right_s = grid_ray_end.x
  // var left_bottom = SCREEN_HEIGHT / 2 + player_ray_start.wall_height / 2
  // var right_bottom = SCREEN_HEIGHT / 2 + grid_ray_end.wall_height / 2
  











  
  var fixed_distance = fixFishEye(ray.distance, ray.angle, player.angle);
  // context.strokeStyle = "#00ff00"
  // drawCircle(ray_i,SCREEN_HEIGHT / 2 + getwallHeight(fixed_distance) / 2)//кружочек
  
  // context.strokeStyle = "#000000"
  // context.strokeText(ray.wall, ray_i, SCREEN_HEIGHT / 2 + getwallHeight(fixed_distance) / 2);//номер квадранта

//  window.circles.push({x:ray_i, y:SCREEN_HEIGHT / 2 + getwallHeight(fixed_distance) / 2, text: ray.wall})
















  // context.beginPath();
  // context.moveTo(left_s, left_bottom);
  // context.lineTo(right_s, right_bottom);
  // context.closePath();
  // context.strokeStyle = "#00ff00";
  // context.stroke();
}

function RenderRay3D2(wall)
{
  return
  var player_distance = 28//поставить игрока на один уровень с линией квадрата, который слева и написать findFirstNonNullArgument(window.rays) - там будет этот distance
  var player_wall_height_aka_y_3D = getwallHeight(player_distance)
  var player_i_aka_x_3D = SCREEN_WIDTH/2
  var player_ray_start = {x:player_i_aka_x_3D,wall_height:player_wall_height_aka_y_3D}
  
  // var grid_ray_height_aka_y_3D = getwallHeight(ray.distance)
  // var grid_ray_i_aka_x_3D = ray_i
  // var grid_ray_end = {x:grid_ray_i_aka_x_3D,wall_height:grid_ray_height_aka_y_3D};

  var left_s = player_ray_start.x
  var right_s = wall.left_side.x
  var left_bottom = SCREEN_HEIGHT / 2 + player_ray_start.wall_height / 2
  var right_bottom = SCREEN_HEIGHT / 2 + wall.left_side.wall_height / 2

  context.beginPath();
  context.moveTo(left_s, left_bottom);
  context.lineTo(right_s, right_bottom);
  context.closePath();
  context.strokeStyle = COLORS.rays;
  context.stroke();
}

function findFirstNonNullArgument(args) {
  
  for (const [index, value] of args.entries()) {
     if (typeof(value)!='undefined') {
        //debugger
        return [index, value];
    }
 }
}

function scanWalls(i,look_direction)
{
  var ray;
  var old_right_side;
  while ( true/*(look_direction == "forward") ? i<=numberOfRays : i>=0*/ ) {
    //if (i>SCREEN_WIDTH) { alert("scanWalls, i>SCREEN_WIDTH"); debugger; }
    var close_far_ray_movement=""
    var forward_jump_occured=false
    angle = corr(window.initialAngle + i * angleStep);
    if (isNaN(angle)) debugger
    //var ray = castRay(angle)
    if (i>SCREEN_WIDTH) { renderMinimap(0, 0, 0.75, 0); debugger }
    
    if (window.slowmotion == true) { renderMinimap(0, 0, 0.75, window.rays); debugger }

    //Выпускает луч. В нём так же рисуются линии на полу.
    ray = castRay2(angle, i, undefined, ((typeof(old_right_side)=='undefined') ? null : old_right_side))
    
    window.cast_ray_count++


    var jump = ""
    if (look_direction == "forward")
    {
      
      //Если по x или по y перескок составил больше одного квадрата значит произошёл перескок на более дальнюю или более ближнюю стену
      //if (x_change>1 || y_change>1 || (x_change==1 && y_change==1 && Math.abs(window.old_distance-ray.distance)>CELL_SIZE/2)) 
      var wall_x1 = parseInt(ray.wall.split(" ")[0])//координата x в массиве карты
      var wall_y1 = parseInt(ray.wall.split(" ")[1])//координата y
      var x_change1 = Math.abs(window.old_wall_x - wall_x1)//изменилась ли координата
      var y_change1 = Math.abs(window.old_wall_y - wall_y1)
      if ((x_change1!=0 && y_change1!=0) || (x_change1==0 && y_change1>1) || (x_change1>1 && y_change1==0))
      {
        if (ray.distance < window.old_distance)
        {
          jump = "jump"
          forward_jump_occured = true
          //jump_type = "close jump"
          if (renderRaysDebug) console.log("jump, x_change:" + x_change1 + " y_change:" + y_change1 + " old_wall:" + window.old_wall_x + " " + window.old_wall_y + " " + window.old_distance + " new_wall:" + wall_x1 + " " + wall_y1 + " " + ray.distance)
        }
        if (ray.distance > window.old_distance)
        {
          //jump_type = "far jump"
        }
      }
      

      if (jump == "jump")
      {
        if (window.old_distance > ray.distance)//и если дистанция стала меньше по сравнению с прошлым лучом значит перескок произошёл на ближнюю стену а значит нужно перемотать назад чтобы найти углы пропущенных стен
        {
          //jump_type = "close jump"
        } else
        {
          //jump_type = "far jump"
          jump = ""
        }
      }
      if (i == 0) jump = ""
    }

    ray.jump = jump


    if (look_direction == "forward" && i>=numberOfRays && ray.jump=="jump" && window.final_jump==false)
    {
      window.final_jump=true
    }
    else if (window.final_jump==true) //
    {
      if (look_direction == "forward" && i>=numberOfRays) break
    } else if (look_direction == "forward" && i>=numberOfRays && ray.jump!="jump")
    {
      break
    }

    if (look_direction == "backward" && i<=0) break

    

    var wall_x = parseInt(ray.wall.split(" ")[0])
    var wall_y = parseInt(ray.wall.split(" ")[1])
    
    var player_cell_x = (player.x - player.x % CELL_SIZE)/CELL_SIZE
    var player_cell_y = (player.y - player.y % CELL_SIZE)/CELL_SIZE
    var wall_orientation = ((ray.vertical == false) ? "horizontal" : "vertical")
    
    
    var x_change = Math.abs(Math.abs(window.old_wall_x) - Math.abs(wall_x))
    var y_change = Math.abs(Math.abs(window.old_wall_y) - Math.abs(wall_y)) 
    
    
    
    
    if (jump == "")//Если jump == "jump" значит луч наскочил на ближнюю стену и его не нужно запоминать, нужно будет потом перемотать назад до левого угла этой ближней стены
    {
      if (look_direction=="forward") window.previous_ray_i_before_jump=i
      ray.jump = "raycast"
      if (typeof(window.rays[i]) != "undefined")
      {
        if (look_direction == "backward") i=i+0.1
        if (look_direction == "forward") i=i-0.1
        if (window.renderRaysDebug == true) { console.log("in getRays i not changed:" + i); debugger}
        //console.log(window.rays[i])
        //console.log(ray)
        //debugger
      }
      window.rays[(parseInt(i)).toString()] = ray;
      if (renderRaysDebug)
      { 
        clearScreen();
        renderMinimap(0, 0, 0.75, window.rays);
        console.log(i + ": " + ray.wall + " end:" + ray.ray_end + " " + wall_orientation + " | rad:" + ray.angle + " | ang:" + (ray.angle * (180 / Math.PI)) + " | " + ray.jump);
        
        var wall = {}
        wall.name = ray.wall + " " + wall_orientation
        wall.i1 = "";
        wall.distance1 = "";
        wall.i2 = "";
        wall.distance2 = "";
        var min_dist = Math.round(((wall.distance1<=wall.distance2) ? wall.distance1 : wall.distance2) * 1000)
        //window.walls[min_dist] = wall

        window.renderRayDebugCurRay++
        if (window.renderRayDebugCurRay>=window.renderRayDebugStartingRay && renderRaysDebug_Debugger==true) debugger
      }
    }
    
    if (look_direction == "forward" && ray.jump == "jump")
    {
      //window.i_during_jump = i
      //window.ray_during_jump = ray//cast'нутый ray который наскочил на ближнюю стену вместо соседней
      window.wall_before_jump = window.wall_befr_jump//чтобы jump'ы отлавливать

      window.jumps.push({
        i_during_jump: i,
        i_before_jump: window.i_befr_jump,
        //ray_during_jump: window.ray_during_jump,
        wall_before_jump: window.wall_before_jump,
        skip_ray_i_before_jump:window.skip_ray_i_before_jump
      })

      jump = ""
      ray.jump = "raycast"
      //if (window.backward_steps==0 || window.backward_steps==1)
      //look_direction = "backward"
      //window.backward_steps++


      if (renderRaysDebug)
      { 
        clearScreen();
        renderMinimap(0, 0, 0.75, window.rays);
        console.log(i + ": " + ray.wall + " end:" + ray.ray_end + " " + wall_orientation + " | " + ray.angle + " | " + (ray.angle * (180 / Math.PI)) + " | " + ray.jump);
        if (ray.jump=="jump")
        {
          console.log("window.skip_ray_i_before_jump: " + window.skip_ray_i_before_jump) //Это нужно чтобы правильно лучи в minimap рисовались
        }
        window.renderRayDebugCurRay++
        console.log("change look_direction=backward i:" + i)
        if (window.renderRayDebugCurRay>=window.renderRayDebugStartingRay && renderRaysDebug_Debugger==true) debugger
      }
      //return i
      //debugger
      
    }

    if (look_direction == "forward" && ray.jump == "raycast")
    {
      window.wall_befr_jump = ray.wall
      window.i_befr_jump = i
      //console.log("window.wall_befr_jump: " + ray.wall)
    }

    if (look_direction == "forward")
    {
      var debug_i = i
      close_far_ray_movement = ((ray.distance < window.old_distance) ? "close" : "far")
      
      if (i <= SCREEN_WIDTH)//Только если i меньше чем SCREEN_WIDTH ему есть куда вперёд ещё скипать
      {
        //В ray_skipper рендерятся стены, помимо всего прочего
        i = Math.round(ray_skipper("forward", close_far_ray_movement, forward_jump_occured, i, ray))//возвращает правую границу стены
        old_right_side = window.right_side_from_skipper;
      }

      
      if (i > SCREEN_WIDTH) debugger
      if (isNaN(i)) debugger
    }
    
    if (look_direction == "backward") 
    {
      if (ray.wall == window.wall_before_jump || i<=window.i_before_jump/*window.previous_ray_i_before_jump*/)
      {
        //i = window.i_during_jump
        //delete window.i_during_jump
        //delete window.wall_before_jump
        //delete window.wall_befr_jump
        //delete window.old_wall_x
        //delete window.old_wall_y
        //delete window.old_distance
        //look_direction = "forward"
        if (window.renderRaysDebug == true) console.log("change look_direction=forward i:" + i)
        delete window.rays[window.wrong_ray_i]
        //window.skip_ray_i_before_jump=-1 //Это нужно чтобы правильно лучи в minimap рисовались
        //var ray1 = window.ray_during_jump
        
        //ray1.jump = "jumped ray from memory"
        //window.wall_befr_jump = ray1.wall
        //var wall_orientation = ((ray1.vertical == false) ? "horizontal" : "vertical")
        if (renderRaysDebug)
        { 
          clearScreen();
          renderMinimap(0, 0, 0.75, window.rays);
          console.log(i + ": " + ray1.wall + " end:" + ray1.ray_end + " " + wall_orientation + " | " + ray1.angle + " | " + (ray1.angle * (180 / Math.PI)) + " | " + ray1.jump);
          window.renderRayDebugCurRay++
          if (window.renderRayDebugCurRay>=window.renderRayDebugStartingRay && renderRaysDebug_Debugger==true) debugger
        }
        //i = ray_skipper("forward", "raycast", i, ray1)
        //i++
        
        //window.old_wall_x = window.ray_during_jump.wall.split(" ")[0]
        //window.old_wall_y = window.ray_during_jump.wall.split(" ")[1]
        //delete window.ray_during_jump
        //window.old_distance = ray1.distance
        return
        //debugger
        
      } else
      {
        var debug_i = i
        jump_type = ((ray.distance < window.old_distance) ? "close" : "far")
        //Тут рендерятся стены помимо всего прочего
        i = Math.round(ray_skipper("backward", close_far_ray_movement, forward_jump_occured, i, ray))
        if (isNaN(i)) debugger
        if (i<0) i=0
      }

    }
    
    window.old_wall_x = wall_x //чтобы jump'ы отлавливать
    window.old_wall_y = wall_y //чтобы jump'ы отлавливать
    window.old_distance = ray.distance //чтобы jump'ы отлавливать
    
    if (look_direction == "forward") { if (i != SCREEN_WIDTH) { i++; } }
    if (look_direction == "backward") { i--; /*window.backward_steps ++*/ }
    if (window.renderRaysDebug == true) console.log("getRays i:" + i + " (" + ((look_direction == "forward") ? "+" : "-")+ "1)")
    
  }

  return i
}
















function apply_move(mx,my)
{ 
  var future_x = player.x + mx
  var future_y = player.y + my

  var future_x_cell = (future_x - (future_x % CELL_SIZE))/CELL_SIZE
  var future_y_cell = (future_y - (future_y % CELL_SIZE))/CELL_SIZE

  var x_cell = (player.x - (player.x % CELL_SIZE))/CELL_SIZE
  var y_cell = (player.y - (player.y % CELL_SIZE))/CELL_SIZE

  var cell_value_xy = map[future_y_cell][future_x_cell]
  var cell_value_x = map[y_cell][future_x_cell]
  var cell_value_y = map[future_y_cell][x_cell]
  //console.log(x_cell + " x " + y_cell + " - " + cell_value)

  if (typeof(cell_value_xy)=='number' && cell_value_xy != 0)//если двигаясь по двум осям врезаемся в стену
  {
    if (cell_value_x == 0) //то если двигаясь по одной оси не врезаемся, значит двигаемся только по одной
    {
      player.x += mx
    }
    
    if (cell_value_y == 0)//или другой
    {
      player.y += my
    }
    if (cell_value_x == -1 || cell_value_y == -1)
    {
      //alert("Exit!")
      Init()
    }
    //если в обоих направлениях тупик - никуда не двигаемся
  } else//иначи можно идти
  {
    player.y += my
    player.x += mx
  }
}

function movePlayer() {
    var mx = Math.cos(player.angle) * player.speed;
    var my = Math.sin(player.angle) * player.speed;
    apply_move(mx, my)
}


function strifePlayer() {
  var mx = Math.cos(player.angle + toRadians(90)) * player.strifeSpeed;
  var my = Math.sin(player.angle + toRadians(90)) * player.strifeSpeed;
  apply_move(mx, my)
}

function rotatePlayer() {
  player.angle += toRadians(player.rotateSpeed);

  if (player.angle > 2*Math.PI)
  {
    player.angle -= 2*Math.PI
  } else if (player.angle < 0)
  {
    player.angle += 2*Math.PI
  }


  //console.log(player.angle + " : " + toDegrees(player.angle))
}

function getwallHeight(dist_ance)
{
  if (arduino==false)
  {
    return (SCREEN_WIDTH * 14.5) / dist_ance
    //return ((CELL_SIZE * (SCREEN_HEIGHT / SCREEN_WIDTH * 6.3)) / dist_ance) * 277 //350
  } else
  {
    return ((CELL_SIZE * 3) / dist_ance) * 25
  }
}

function renderLetters()
{
  if (true)//Добавление букв
  {
    for (let t = 0; t < window.textures.length; t++) {
      const element = window.textures[t];
      var el_x = element.split(" ")[0]
      var el_y = element.split(" ")[1]
      var txt_x = el_x * CELL_SIZE + CELL_SIZE/2
      var txt_y = el_y * CELL_SIZE + CELL_SIZE/2
      var dist = distance(player.x, player.y, txt_x, txt_y)
      
      var angle_new = Math.atan2(txt_y - player.y, txt_x - player.x) //* 180 / Math.PI;
      
      dist = fixFishEye(dist, angle_new, player.angle);
  
      window.wallHeight = getwallHeight(dist)//((CELL_SIZE * 3) / dist) * 277;
      
      const initialAngle = corr(player.angle - FOV / 2) 
      window.numberOfRays = SCREEN_WIDTH/v_step;
      window.angleStep = FOV / numberOfRays;
      const finalAngle = corr(initialAngle + numberOfRays * angleStep)
      
      var i = angle_diff(initialAngle,angle_new)
      //console.log((initialAngle + Math.PI) + " " + (finalAngle + Math.PI) + " " + (angle_new + Math.PI) + " " + i)
      //console.log(((initialAngle * 180 / Math.PI)+180) + " " + ((finalAngle * 180 / Math.PI)+180) + " " + ((angle_new * 180 / Math.PI)+180) + " " + i)
      
      if (initialAngle<finalAngle)
      {
        var usl=(angle_new + Math.PI) > (initialAngle + Math.PI) && (angle_new + Math.PI)<(finalAngle + Math.PI) 
      } else
      {
        var usl1=(angle_new + Math.PI) > (initialAngle + Math.PI) && (angle_new + Math.PI)<(Math.PI*2) 
        var usl2=(angle_new + Math.PI) > (0) && (angle_new + Math.PI)<(finalAngle + Math.PI) 
        var usl=(usl1||usl2)
      }
      
      if (usl)
      {
        // context.fillStyle = "#00F";
        // context.strokeStyle = "#FFF";
        // context.font = Math.round(wallHeight*0.5) + 'px Arial';
        // context.strokeText(map[el_y][el_x], i, SCREEN_HEIGHT / 2 + wallHeight/2);
  
        var wall_i = Math.round(dist*100)
        if (typeof(window.walls[wall_i]) == 'undefined') window.walls[wall_i]=[]
  
        window.walls[wall_i].push({text:map[el_y][el_x],x:i,height:wallHeight})
  
      }
    }
    window.textures=[]
  }
}


// function renderSceneFromWalls(reversewalls)
// {


//   if (window.slowmotion!=true)//просто отрисовать
//   {
//     window.walls_changed = (json_var_dump(reversewalls) != window.old_wall_dump)
//     window.old_wall_dump = json_var_dump(reversewalls)
//     for(var i=0;i<reversewalls.length;i++)
//     {
//       renderWall(reversewalls[i])
//     }
//   } else//отрисовать медленно по одной стеночке
//   {
//     window.sm_walls = reversewalls
//     window.sm_i = -1
//     clearInterval(window.gameloop_interval)
//     SM_RenderSceneFromWalls()
//   }
// }

// function SM_RenderSceneFromWalls()
// {
//   window.sm_i++

//   if (window.sm_i>=window.sm_walls.length) 
//   {
//     window.slowmotion=false
//     window.gameloop_interval = setInterval(gameLoop, TICK);
//     //debugger
//     return
//   }
//   renderWall(window.sm_walls[window.sm_i])
//   setTimeout(SM_RenderSceneFromWalls, 100)

// }

//Рендеринг линии на полу
function RenderGridSide(gridSide, color)
{
  //Пол
  var left_s = gridSide.wall_left_side.x
  var right_s = gridSide.wall_right_side.x
  var left_bottom = SCREEN_HEIGHT / 2 + gridSide.wall_left_side.wall_height / 2
  var right_bottom = SCREEN_HEIGHT / 2 + gridSide.wall_right_side.wall_height / 2

  //window.circles.push({x:left_s, y:left_bottom, text: ""})
  //window.circles.push({x:right_s, y:right_bottom, text: ""})

  context.beginPath();
  context.moveTo(left_s, left_bottom);
  context.lineTo(right_s, right_bottom);
  context.closePath();
  context.strokeStyle = color;
  context.stroke();

  //Потолок
  if (true)
  {
    var left_s = gridSide.wall_left_side.x
    var right_s = gridSide.wall_right_side.x
    var left_bottom = SCREEN_HEIGHT / 2 - gridSide.wall_left_side.wall_height / 2
    var right_bottom = SCREEN_HEIGHT / 2 - gridSide.wall_right_side.wall_height / 2
  
    if (window.beautify == true) { color = "#555555"}
    context.beginPath();
    context.moveTo(left_s, left_bottom);
    context.lineTo(right_s, right_bottom);
    context.closePath();
    context.strokeStyle = color;
    context.stroke();
  }

  //debugger

}

function add_primary_floor_coord(grid_x_y, screen_x, screen_y)
{
  var key = grid_x_y.toString()
  if (typeof(window.floor_grid[key]) == 'undefined') { window.floor_grid[key] = {} }

  if (typeof(window.floor_grid[key][key]) == 'undefined')
  {
    window.floor_grid[key][key] = [screen_x, screen_y]
  }

  if (window.map[grid_x_y[1]-1][grid_x_y[0]] == 0)
  {
    add_secondary_floor_coord2([grid_x_y[0], grid_x_y[1]-1], grid_x_y, screen_x, screen_y)
  }

  if (window.map[grid_x_y[1]][grid_x_y[0]-1] == 0)
  {
    add_secondary_floor_coord2([grid_x_y[0]-1, grid_x_y[1]], grid_x_y, screen_x, screen_y)
  }

}

function add_secondary_floor_coord(grid_x_y, screen_x, screen_y)
{
  if (window.map[grid_x_y[1]-1][grid_x_y[0]] == 0)
  {
    add_secondary_floor_coord2([grid_x_y[0],grid_x_y[1]-1], grid_x_y, screen_x, screen_y)
  }

  if (window.map[grid_x_y[1]][grid_x_y[0]-1] == 0)
  {
    add_secondary_floor_coord2([grid_x_y[0]-1,grid_x_y[1]], grid_x_y, screen_x, screen_y)
  }

  if (window.map[grid_x_y[1]-1][grid_x_y[0]-1] == 0)
  {
    add_secondary_floor_coord2([grid_x_y[0]-1,grid_x_y[1]-1], grid_x_y, screen_x, screen_y)
  }
}


function add_secondary_floor_coord2(grid_x_y, secondary_x_y, screen_x, screen_y)
{
  var grid_key = grid_x_y.toString()
  var dot_key = secondary_x_y.toString()
  if (typeof(window.floor_grid[grid_key]) == 'undefined') { window.floor_grid[grid_key] = {} }
  
  if (typeof(window.floor_grid[grid_key][dot_key]) == 'undefined')
  {
    window.floor_grid[grid_key][dot_key] = [screen_x, screen_y]
  }

}

function renderWall(wall, left_x_y, right_x_y)//отрисовать одну стеночку
{

  //var wall_left_side = {x:left_i,wall_height:left_height}
  //var wall_right_side = {x:right_i,wall_height:right_height}
  //window.walls[wall_i].push({left_side:wall_left_side,right_side:wall_right_side})
  
  /////////////////////////////////swindow.walls.slice().reverse().forEach((walls, i) => {
  //window.walls.forEach((walls, i) => {
    window.walls_debug = walls
    window.i_debug = i
    window.leftest_wall_x = 10000;
    window.leftest_wall_index=0;
    //walls.forEach((wall, j) => {

      if (typeof(wall.left_side)!='undefined')
      {
        //Это чтобы линии стен не пересекались
        wall.left_side.wall_height=Math.abs(wall.left_side.wall_height)
        wall.right_side.wall_height=Math.abs(wall.right_side.wall_height)


        var left_s = wall.left_side.x
        var right_s = wall.right_side.x*v_step
        var left_top = window.SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2
        var right_top = window.SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2
        var left_bottom = window.SCREEN_HEIGHT / 2 + wall.left_side.wall_height / 2
        var right_bottom = window.SCREEN_HEIGHT / 2 + wall.right_side.wall_height / 2
        var left_height = wall.left_side.wall_height
        var right_height = wall.right_side.wall_height
        
        if (right_s<window.leftest_wall_x) { window.leftest_wall_x=right_s; window.leftest_wall_index=walls.indexOf(wall); }

        // if (false/*left_s<0 || right_s<0*/)
        // {
        //   if (left_s<0)
        //   {
        //     context.beginPath();//Правая линия
        //     context.strokeStyle = "#ff9900";
        //     context.fillStyle = "#ff9900";
        //     context.moveTo(wall.right_side.x*v_step,SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2 + wall.right_side.wall_height);
        //     context.lineTo(wall.right_side.x*v_step,SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2);
        //     context.closePath();
        //     context.stroke();
        //   }
        //   if (right_s<0)
        //   {
        //     context.beginPath();//Левая линия
        //     context.strokeStyle = "#ff9900";
        //     context.fillStyle = "#ff9900";
        //     context.moveTo(wall.left_side.x, SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2 + wall.left_side.wall_height);
        //     context.lineTo(wall.left_side.x, SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2);
        //     context.closePath();
        //     context.stroke();
        //   }
        // } else
        // {
        // }
        
        if (window.walls_changed) console.log(left_s + "." + left_top + ", " + right_s + "." + right_top + ", " + right_s + "." + right_bottom + ", " + left_s + "." + left_bottom)

          //Четырёхугольник
          let poly = new Path2D();
          poly.moveTo(left_s, left_top);//верх лев
          poly.lineTo(right_s, right_top);//верх прав
          poly.lineTo(right_s, right_bottom);//ниж прав
          poly.lineTo(left_s, left_bottom);//ниж лев
          poly.lineTo(left_s, left_top);//верх лев
          poly.closePath();





          //заливка прямоугольников
          // if (left_s<0 || right_s<0 || left_top<0 || right_top<0 || left_bottom<0 || right_bottom<0)
          // {
          //   context.fillStyle = "#FF0000";
          // } else
          // {
          //   context.fillStyle = "#0000FF";
          // }

           //console.log(hex_color)
          context.fillStyle = ((monochrome == true) ? "#00FFFF" : wall.color)
          //"rgb("+clr.r+","+clr.g+","+clr.b+")"//"#0000FF";
          context.fill(poly, 'evenodd');
          //рамочка прямоугольников
          
          if (window.beautify == true)
          {
            color = "#000000"
          } else
          {
            color = "#00FFFF"
          }

          context.strokeStyle = ((monochrome == true) ? "black" : color);
          context.stroke(poly);


          if (window.map[left_x_y[1]][left_x_y[0]] == 0)
          {
            //renderMinimap(0, 0, 0.75);
            
            add_primary_floor_coord(left_x_y, left_s, left_bottom)

            window.circles.push({x:left_s, y:left_bottom, text: left_x_y, color:"lightgreen", top: 0})
          } else
          {
            add_secondary_floor_coord(left_x_y, left_s, left_bottom)
            
            window.circles.push({x:left_s, y:left_bottom, text: left_x_y, color:"red", top: -15})
          }
          
          if (window.map[right_x_y[1]][right_x_y[0]] == 0)
          {
            add_primary_floor_coord(right_x_y, right_s, right_bottom)
            //renderMinimap(0, 0, 0.75);
            window.circles.push({x:right_s, y:right_bottom, text: right_x_y, color:"blue", top: -30})
          } else
          {

            add_secondary_floor_coord(right_x_y, right_s, right_bottom)

            //add_secondary_floor_coord(right_x_y, right_s, right_bottom)
            window.circles.push({x:right_s, y:right_bottom, text: right_x_y, color:"cyan", top: -45})
          }
  
          //Линии внутри четырёхугольников
          // var cells_x=2
          // for (var i1 = 1; i1 < cells_x; i1++) {
          //   var streak_x = left_s+(((right_s-left_s)/cells_x)*i1)
          //   var streak_height = left_height+(((right_height-left_height)/cells_x)*i1)
          //   context.beginPath();
          //   context.moveTo(streak_x, SCREEN_HEIGHT / 2 - streak_height / 2);
          //   context.lineTo(streak_x,SCREEN_HEIGHT / 2 + streak_height / 2);
          //   context.closePath();
          //   context.strokeStyle = "#009900";
          //   context.stroke();
          // }

          if (false)//крест
          {
            context.beginPath();
            context.moveTo(left_s, left_top);
            context.lineTo(right_s, right_bottom);
            context.closePath();
            context.strokeStyle = "#009900";
            context.stroke();
  
            context.beginPath();
            context.moveTo(right_s, right_top);
            context.lineTo(left_s, left_bottom);
            context.closePath();
            context.strokeStyle = "#009900";
            context.stroke();
          }


          //cross(x1, y1, x2, y2, x3, y3, x4, y4)



          //Верт линия по середине четырёхугольника
          // context.beginPath();
          // context.moveTo(x_center, y_center_top);
          // context.lineTo(x_center, y_center_bottom);
          // context.closePath();
          // context.strokeStyle = "#009900";
          // context.stroke();




          //Вертикальные линии с учётом перспективы
          if (false)
          {
            var crs = cross(left_s, left_bottom, right_s, right_top, left_s, left_top, right_s, right_bottom)//Координаты пересечения диагоналей четырёхугольников
            var x_center = crs[0]
            //drawCircle(crs[0],crs[1])
            //var perc = (x_center-left_s)/(right_s-left_s) //Сколько процентов занимает "расстояние от левого края четырёхугольника до точки пересечения" от "ширины четырёхугольника"
  
            var deep = window.seg_sqrt // колво секций будет получаться deep в квадарте
            var segments=[]
            
            segments.push({left_s:left_s,right_s:right_s,left_top:left_top,left_bottom:left_bottom,right_top:right_top,right_bottom:right_bottom})
            for (let d = 0; d <= deep-1; d++) {
              var segments1=[]
              for (let s = 0; s < segments.length; s++) {


                var crs2 = cross(segments[s].left_s, segments[s].left_bottom, segments[s].right_s, segments[s].right_top, segments[s].left_s, segments[s].left_top, segments[s].right_s, segments[s].right_bottom)//Координаты пересечения диагоналей четырёхугольников
                var middle_x = crs2[0]
                var perc2 = (middle_x-segments[s].left_s)/(segments[s].right_s-segments[s].left_s)


                //var middle_x = center(segments[s].left_s,segments[s].right_s,perc)
                var middle_y_top = center(segments[s].left_top,segments[s].right_top,perc2)
                var middle_y_bottom = center(segments[s].left_bottom,segments[s].right_bottom,perc2)
  
                //Вертикальная линия по середине сегмента
                // context.beginPath();
                // context.moveTo(middle_x, middle_y_top);
                // context.lineTo(middle_x, middle_y_bottom);
                // context.closePath();
                // context.strokeStyle = "#009900";
                // context.stroke();


                if (false)//крест
                {
                  context.beginPath();
                  context.moveTo(segments[s].left_s, segments[s].left_top);
                  context.lineTo(segments[s].right_s, segments[s].right_bottom);
                  context.closePath();
                  context.strokeStyle = "#009900";
                  context.stroke();
        
                  context.beginPath();
                  context.moveTo(segments[s].right_s, segments[s].right_top);
                  context.lineTo(segments[s].left_s, segments[s].left_bottom);
                  context.closePath();
                  context.strokeStyle = "#009900";
                  context.stroke();
                }
                
                segments1.push({left_s:segments[s].left_s, right_s:middle_x, left_top:segments[s].left_top, left_bottom:segments[s].left_bottom, right_top:middle_y_top, right_bottom:middle_y_bottom})
                segments1.push({left_s:middle_x, right_s:segments[s].right_s, left_top:middle_y_top, left_bottom:middle_y_bottom, right_top:segments[s].right_top, right_bottom:segments[s].right_bottom})
                
              }
              segments=segments1
          }

          


          for (let s = 0; s < segments.length; s++) {
            //Четырёхугольник
            let poly = new Path2D();
            poly.moveTo(segments[s].left_s, segments[s].left_top);//верх лев
            poly.lineTo(segments[s].right_s+1, segments[s].right_top);//верх прав
            poly.lineTo(segments[s].right_s+1, segments[s].right_bottom);//ниж прав
            poly.lineTo(segments[s].left_s, segments[s].left_bottom);//ниж лев
            poly.lineTo(segments[s].left_s, segments[s].left_top);//верх лев
            poly.closePath();
            var r = Math.round(Math.random()*128+64)
            var g = 0
            var b = 0
            context.fillStyle = seg_colors[s]//"rgb("+r+","+g+","+b+")";//"#"+(r).toString(16)+(g).toString(16)+(b).toString(16);;
            context.fill(poly, 'evenodd');
          }
          




          }











        // context.beginPath();//Верхняя линия
        // context.moveTo(wall.left_side.x, SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2);//верх лев
        // context.lineTo(wall.right_side.x*v_step,SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2);//верх прав
        // context.closePath();
        // context.fillStyle = "#ff9900";
        // context.fill(poly, 'evenodd');
        // context.strokeStyle = "#ff9900";
        // context.stroke(poly);
        // //context.fill()
        // //context.stroke();
        

        // context.beginPath();//Нижняя линия
        // context.strokeStyle = "#ff9900";
        // context.fillStyle = "#ff9900";
        // context.moveTo(wall.left_side.x, SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2 + wall.left_side.wall_height);
        // context.lineTo(wall.right_side.x*v_step,SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2 + wall.right_side.wall_height);
        // context.closePath();
        
        // context.stroke();
        // context.fill()

        // context.beginPath();//Левая линия
        // context.strokeStyle = "#ff9900";
        // context.fillStyle = "#ff9900";
        // context.moveTo(wall.left_side.x, SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2 + wall.left_side.wall_height);
        // context.lineTo(wall.left_side.x, SCREEN_HEIGHT / 2 - wall.left_side.wall_height / 2);
        // context.closePath();
        
        // context.stroke();
        // context.fill()

        // context.beginPath();//Правая линия
        // context.strokeStyle = "#ff9900";
        // context.fillStyle = "#ff9900";
        // context.moveTo(wall.right_side.x*v_step,SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2 + wall.right_side.wall_height);
        // context.lineTo(wall.right_side.x*v_step,SCREEN_HEIGHT / 2 - wall.right_side.wall_height / 2);
        // context.closePath();
          
        // context.stroke();
        // context.fill()








        //   if (false)//стены в клеточку
        //   {
        //     context.beginPath();//Верхняя линия
        //     context.strokeStyle = "#ff9900";
        //     context.moveTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2);
        //     context.lineTo(i*v_step,SCREEN_HEIGHT / 2 - wallHeight / 2);
        //     context.lineTo(i*v_step,SCREEN_HEIGHT / 2 + wallHeight / 2);
        //     context.lineTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2 + window.old_wall_height);
        //     context.lineTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2);
        //     context.closePath();
        //     context.stroke();

        //     var left_wall_top = SCREEN_HEIGHT / 2 - window.old_wall_height / 2
        //     var right_wall_top = SCREEN_HEIGHT / 2 - wallHeight / 2
        //     var left_wall_height = (SCREEN_HEIGHT / 2 - window.old_wall_height / 2 + window.old_wall_height) - (left_wall_top)
        //     var right_wall_height = (SCREEN_HEIGHT / 2 + wallHeight / 2) - (right_wall_top)
            
        //     var grid_res = 10
        //     var lwstep = left_wall_height / grid_res
        //     var rwstep = right_wall_height / grid_res
        //     for (let g = 0; g < grid_res; g++) {
        //       context.beginPath();//Верхняя линия
        //       context.strokeStyle = "#ff9900";
        //       context.moveTo(window.old_wall_i, left_wall_top + lwstep*g);
        //       context.lineTo(i*v_step, right_wall_top + rwstep*g);
        //       context.closePath();
        //       context.stroke();
        //     }

        //     var wall_height_diff = right_wall_height - left_wall_height
        //     var wall_x_diff = i*v_step - window.old_wall_i
        //     var whstep = wall_height_diff / grid_res
        //     var wxstep = wall_x_diff / grid_res
        //     for (let g = 0; g < grid_res; g++) {
        //       context.beginPath();//Верхняя линия
        //       context.strokeStyle = "#ff9900";
        //       context.moveTo(window.old_wall_i + wxstep * g, SCREEN_HEIGHT / 2 - (left_wall_height+whstep*g) / 2);
        //       context.lineTo(window.old_wall_i + wxstep * g, SCREEN_HEIGHT / 2 + (left_wall_height+whstep*g) / 2);
        //       context.closePath();
        //       context.stroke();
        //     }
        //   }
        // }

      } else if (typeof(wall.text) != 'undefined')
      {
        context.fillStyle = "#00F";
        context.strokeStyle = "#FFF";
        context.font = Math.round(wall.height*0.5) + 'px Arial';
        context.strokeText(wall.text, wall.x, SCREEN_HEIGHT / 2 + wall.height/2);
      }



    //}
    //)

    //if (window.slowmotion == true) debugger//pauseBrowser(200)
    
  ////////////////////////////////})

  //window.slowmotion = false

}

function RenderGrid()
{
  
  var grid_cells = Object.keys(window.floor_grid)

  
  for (let cl_i = 0; cl_i < grid_cells.length; cl_i++) {
    const cl = grid_cells[cl_i];
    
    var dot_count = Object.keys(window.floor_grid[cl]).length
    if (dot_count == 4)
    {
      
      var cl_split = cl.split(",")
      var dot1 = cl
      var dot2 = (parseInt(cl_split[0]) + 1) + "," + parseInt(cl_split[1])
      var dot3 = (parseInt(cl_split[0]) + 1) + "," + (parseInt(cl_split[1]) + 1)
      var dot4 = parseInt(cl_split[0]) + "," + (parseInt(cl_split[1]) + 1)
      
      var dot1_x = window.floor_grid[cl][dot1][0]
      var dot1_y = window.floor_grid[cl][dot1][1]

      var dot2_x = window.floor_grid[cl][dot2][0]
      var dot2_y = window.floor_grid[cl][dot2][1]

      var dot3_x = window.floor_grid[cl][dot3][0]
      var dot3_y = window.floor_grid[cl][dot3][1]

      var dot4_x = window.floor_grid[cl][dot4][0]
      var dot4_y = window.floor_grid[cl][dot4][1]

      //Четырёхугольник
      let poly = new Path2D();
      poly.moveTo(dot1_x, dot1_y);//верх лев
      poly.lineTo(dot2_x, dot2_y);//верх прав
      poly.lineTo(dot3_x, dot3_y);//ниж прав
      poly.lineTo(dot4_x, dot4_y);//ниж лев
      poly.lineTo(dot1_x, dot1_y);//верх лев
      poly.closePath();
      context.fillStyle = "darkcyan"
      context.strokeStyle = "cyan";
      context.fill(poly, 'evenodd');
      context.stroke(poly);
    }
  }



  
}


function pauseBrowser(millis) {
  var date = Date.now();
  var curDate = null;
  do {
      curDate = Date.now();
  } while (curDate-date < millis);
}


//Чтобы определить Y координату центра верхней или нижней грани четырёхугольника
function center(p1,p2,perc)
{
  return p1+(p2-p1)*perc;
}








function drawCircle(x,y)
{
  context.beginPath();
  context.arc(x, y, 5, 0, 2 * Math.PI);
  context.stroke();
}




/*
function renderScene(rays) {
  window.old_ray_wall = rays[0].wall
  rays.forEach((ray, i) => {
    //debugger
    const distance = fixFishEye(ray.distance, ray.angle, player.angle);
    //const distance = ray.distance//fixFishEye(ray.distance, ray.angle, player.angle);
    const wallHeight = getwallHeight(distance)
    //context.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
    
      if (arduino == true) context.fillStyle = COLORS.wall;
      
      if (ray.wall != window.old_ray_wall || i==0)
      {
        context.fillRect(i*v_step, SCREEN_HEIGHT / 2 - wallHeight / 2, v_step, wallHeight);
      } else
      {
        //var width =  
        //context.fillRect(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2, i*v_step-window.old_wall_i, wallHeight);//вверху от старой стены


        context.beginPath();//Верхняя линия
        context.strokeStyle = "#ff9900";
        context.fillStyle.strokeStyle = "#000000";
        context.moveTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2);
        context.lineTo(i*v_step,SCREEN_HEIGHT / 2 - wallHeight / 2);
        context.closePath();
        //context.fill()
        context.stroke();

        context.beginPath();//Нижняя линия
        context.strokeStyle = "#ff9900";
        context.fillStyle.strokeStyle = "#000000";
        context.moveTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2 + window.old_wall_height);
        context.lineTo(i*v_step,SCREEN_HEIGHT / 2 - wallHeight / 2 + wallHeight);
        context.closePath();
        //context.fill()
        context.stroke();

        context.beginPath();//Левая линия
        context.strokeStyle = "#ff9900";
        context.fillStyle.strokeStyle = "#000000";
        context.moveTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2 + window.old_wall_height);
        context.lineTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2);
        context.closePath();
        //context.fill()
        context.stroke();

        context.beginPath();//Правая линия
        context.strokeStyle = "#ff9900";
        context.fillStyle.strokeStyle = "#000000";
        context.moveTo(i*v_step,SCREEN_HEIGHT / 2 - wallHeight / 2 + wallHeight);
        context.lineTo(i*v_step,SCREEN_HEIGHT / 2 - wallHeight / 2);
        context.closePath();
        //context.fill()
        context.stroke();

        // context.beginPath();//Верхняя линия
        // context.strokeStyle = "#ff9900";
        // context.moveTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2);
        // context.lineTo(i*v_step,SCREEN_HEIGHT / 2 - wallHeight / 2);
        // context.lineTo(i*v_step,SCREEN_HEIGHT / 2 + wallHeight / 2);
        // context.lineTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2 + window.old_wall_height);
        // context.lineTo(window.old_wall_i, SCREEN_HEIGHT / 2 - window.old_wall_height / 2);
        // context.closePath();
        // context.stroke();






      }
      
      window.old_wall_height = wallHeight
      window.old_wall_i = i*v_step
      window.old_ray_wall = ray.wall
  });

  for (let t = 0; t < window.textures.length; t++) {
    const element = window.textures[t];
    var el_x = element.split(" ")[0]
    var el_y = element.split(" ")[1]
    var txt_x = el_x * CELL_SIZE + CELL_SIZE/2
    var txt_y = el_y * CELL_SIZE+ CELL_SIZE/2
    var dist = distance(player.x, player.y, txt_x, txt_y)

    window.wallHeight = ((CELL_SIZE * 3) / dist) * 277;
    var angle_new = Math.atan2(txt_y - player.y, txt_x - player.x) //* 180 / Math.PI;
    const initialAngle = corr(player.angle - FOV / 2) 
    window.numberOfRays = SCREEN_WIDTH/v_step;
    window.angleStep = FOV / numberOfRays;
    const finalAngle = corr(initialAngle + numberOfRays * angleStep)
    
    var i = angle_diff(initialAngle,angle_new)
    //console.log((initialAngle + Math.PI) + " " + (finalAngle + Math.PI) + " " + (angle_new + Math.PI) + " " + i)
    //console.log(((initialAngle * 180 / Math.PI)+180) + " " + ((finalAngle * 180 / Math.PI)+180) + " " + ((angle_new * 180 / Math.PI)+180) + " " + i)
    
    if (initialAngle<finalAngle)
    {
      var usl=(angle_new + Math.PI) > (initialAngle + Math.PI) && (angle_new + Math.PI)<(finalAngle + Math.PI) 
    } else
    {
      var usl1=(angle_new + Math.PI) > (initialAngle + Math.PI) && (angle_new + Math.PI)<(Math.PI*2) 
      var usl2=(angle_new + Math.PI) > (0) && (angle_new + Math.PI)<(finalAngle + Math.PI) 
      var usl=(usl1||usl2)
    }
    
    
    
    
    if (usl)
    {
      context.fillStyle = "#00F";
      context.strokeStyle = "#FFF";
      context.font = Math.round(wallHeight*0.5) + 'px Arial';
      context.strokeText(map[el_y][el_x], i, SCREEN_HEIGHT / 2 + wallHeight/2);
    }
  }
  window.textures=[]

}
*/







canvas.addEventListener("click", () => {
  //console.log(document.pointerLockElement)
  canvas.requestPointerLock();
  
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    player.speed = 2;
  }
  if (e.key === "ArrowDown") {
    player.speed = -2;
  }
  if (e.key === "ArrowLeft") {
    //player.rotateSpeed = -4;
    player.strifeSpeed = -2;
  }
  if (e.key === "ArrowRight") {
    //player.rotateSpeed = 4;
    player.strifeSpeed = 2;
  }

});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    player.speed = 0;
  }
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    player.strifeSpeed = 0;
  }
  if (e.key === "c" ) {
    console.log("if (true) { player.x=" + player.x + "; player.y=" + player.y + "; player.angle=" + player.angle + "; }")
  }
  //console.log(e.key)
  if (e.key === "m")
  {
    window.minimapVisible = !window.minimapVisible
  }
});

document.addEventListener("mousemove", function (event) {
  if (document.pointerLockElement != null)
  {
    if (window.renderRaysDebug == false)
    {
      var mx = Math.cos(player.angle) * -event.movementY/4;
      var my = Math.sin(player.angle) * -event.movementY/4;
      apply_move(mx,my)
      player.angle += toRadians(event.movementX/4);
      //console.log(corr(player.angle))
  
      //player.angle = player.angle % (Math.PI)
      //console.log(player.angle)
    }
  }
  

});

document.addEventListener("mousedown", function (event) {
  if (document.pointerLockElement != null) { window.slowmotion = true; clearScreen() }
});



//https://habr.com/ru/post/523440/?ysclid=l6303xvge2523552793
function cross(x1, y1, x2, y2, x3, y3, x4, y4) {
  var dot=[];
  var n;
  if (y2 - y1 != 0) {  // a(y)
      var q = (x2 - x1) / (y1 - y2);   
      var sn = (x3 - x4) + (y3 - y4) * q; if (!sn) { return dot; }  // c(x) + c(y)*q
      var fn = (x3 - x1) + (y3 - y1) * q;   // b(x) + b(y)*q
      n = fn / sn;
  }
  else {
      if (!(y3 - y4)) { return dot; }  // b(y)
      n = (y3 - y1) / (y3 - y4);   // c(y)/b(y)
  }
  dot[0] = x3 + (x4 - x3) * n;  // x3 + (-b(x))*n
  dot[1] = y3 + (y4 - y3) * n;  // y3 +(-b(y))*n
  return dot;
}

function json_var_dump(ajvar) {
  return JSON.stringify(JSON.decycle(ajvar))
}


if (typeof JSON.decycle !== "function") {
  JSON.decycle = function decycle(object, replacer) {
      "use strict";

      // Make a deep copy of an object or array, assuring that there is at most
      // one instance of each object or array in the resulting structure. The
      // duplicate references (which might be forming cycles) are replaced with
      // an object of the form

      //      {"$ref": PATH}

      // where the PATH is a JSONPath string that locates the first occurance.

      // So,

      //      var a = [];
      //      a[0] = a;
      //      return JSON.stringify(JSON.decycle(a));

      // produces the string '[{"$ref":"$"}]'.

      // If a replacer function is provided, then it will be called for each value.
      // A replacer function receives a value and returns a replacement value.

      // JSONPath is used to locate the unique object. $ indicates the top level of
      // the object or array. [NUMBER] or [STRING] indicates a child element or
      // property.

      var objects = new WeakMap();     // object to path mappings

      return (function derez(value, path) {

          // The derez function recurses through the object, producing the deep copy.

          var old_path;   // The path of an earlier occurance of value
          var nu;         // The new object or array

          // If a replacer function was provided, then call it to get a replacement value.

          if (replacer !== undefined) {
              value = replacer(value);
          }

          // typeof null === "object", so go on if this value is really an object but not
          // one of the weird builtin objects.

          if (
              typeof value === "object" && value !== null &&
              !(value instanceof Boolean) &&
              !(value instanceof Date) &&
              !(value instanceof Number) &&
              !(value instanceof RegExp) &&
              !(value instanceof String)
          ) {

              // If the value is an object or array, look to see if we have already
              // encountered it. If so, return a {"$ref":PATH} object. This uses an
              // ES6 WeakMap.

              old_path = objects.get(value);
              if (old_path !== undefined) {
                  return { $ref: old_path };
              }

              // Otherwise, accumulate the unique value and its path.

              objects.set(value, path);

              // If it is an array, replicate the array.

              if (Array.isArray(value)) {
                  nu = [];
                  value.forEach(function (element, i) {
                      nu[i] = derez(element, path + "[" + i + "]");
                  });
              } else {

                  // If it is an object, replicate the object.

                  nu = {};
                  Object.keys(value).forEach(function (name) {
                      nu[name] = derez(
                          value[name],
                          path + "[" + JSON.stringify(name) + "]"
                      );
                  });
              }
              return nu;
          }
          return value;
      }(object, "$"));
  };
}


if (typeof JSON.retrocycle !== "function") {
  JSON.retrocycle = function retrocycle($) {
      "use strict";

      // Restore an object that was reduced by decycle. Members whose values are
      // objects of the form
      //      {$ref: PATH}
      // are replaced with references to the value found by the PATH. This will
      // restore cycles. The object will be mutated.

      // The eval function is used to locate the values described by a PATH. The
      // root object is kept in a $ variable. A regular expression is used to
      // assure that the PATH is extremely well formed. The regexp contains nested
      // * quantifiers. That has been known to have extremely bad performance
      // problems on some browsers for very long strings. A PATH is expected to be
      // reasonably short. A PATH is allowed to belong to a very restricted subset of
      // Goessner's JSONPath.

      // So,
      //      var s = '[{"$ref":"$"}]';
      //      return JSON.retrocycle(JSON.parse(s));
      // produces an array containing a single element which is the array itself.

      var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\([\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

      (function rez(value) {

          // The rez function walks recursively through the object looking for $ref
          // properties. When it finds one that has a value that is a path, then it
          // replaces the $ref object with a reference to the value that is found by
          // the path.

          if (value && typeof value === "object") {
              if (Array.isArray(value)) {
                  value.forEach(function (element, i) {
                      if (typeof element === "object" && element !== null) {
                          var path = element.$ref;
                          if (typeof path === "string" && px.test(path)) {
                              value[i] = eval(path);
                          } else {
                              rez(element);
                          }
                      }
                  });
              } else {
                  Object.keys(value).forEach(function (name) {
                      var item = value[name];
                      if (typeof item === "object" && item !== null) {
                          var path = item.$ref;
                          if (typeof path === "string" && px.test(path)) {
                              value[name] = eval(path);
                          } else {
                              rez(item);
                          }
                      }
                  });
              }
          }
      }($));
      return $;
  };
}
