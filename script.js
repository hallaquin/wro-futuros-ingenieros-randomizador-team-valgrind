function debug(string) {
    console.log(string)
}

// Iniciamos por defecto en ronda Abierta
var round = "Abierta"; 
var timerState = "Iniciar";
var timer = 0;
var timerInterval;
var attemptCounter = 0;

var car, lightSigns=[], walls=[0, 0, 0, 0], parkingPos;

function toggleRound() {
  if(round == "Abierta") {
    round = "Cerrada";
    renderMat();
  }
  else {
    round = "Abierta";
    renderMat();
  }
}

function startTimer() {
  if(timerState == "Iniciar") {
    timerState = "Detener";
    timer = 0;

    timerInterval = setInterval(function() {
      timer++;
      var secs = Math.floor(timer / 100);
      document.getElementById("timer-mmss").innerHTML = Math.floor(secs / 60) + ":" + ("0" + secs % 60).slice(-2);
      document.getElementById("timer-ms").innerHTML = ("0" + timer % 100).slice(-2);
    }
    , 10);
  }
  else {
    timerState = "Iniciar";
    clearInterval(timerInterval);
  }

  document.getElementById("timer_button").innerHTML = timerState;
}

function carInWall() {
  return walls[car.side] == 1 && (car.position == 0 || car.position == 3);
}

function randomizer() {
  for (let i = 0; i < 4; i++) {
    lightSigns[i] = [];
    for (let j = 0; j < 6; j++) {
      lightSigns[i][j] = 0;
    }
  }

  if(round == 'Abierta') {
    for(let i = 0; i < 4; i++) {
      walls[i] = Math.floor(Math.random() * 2);
    }

    car = {
      "side": Math.floor(Math.random() * 4),
      "position": Math.floor(Math.random() * 6),
      "direction": Math.floor(Math.random() * 2) * 2 - 1,
    };

    while(carInWall()) {
      car = {
        "side": Math.floor(Math.random() * 4),
        "position": Math.floor(Math.random() * 6),
        "direction": Math.floor(Math.random() * 2) * 2 - 1,
      };
    }
    
    parkingPos = -1; 
  }
  else if(round == 'Cerrada') {
    for(let i = 0; i < 4; i++) {
      walls[i] = 0;
    }

    // El estacionamiento se genera al azar en uno de los 4 cuadrantes
    parkingPos = Math.floor(Math.random() * 4);
    
    // Sentido horario (1) o antihorario (-1)
    var dir = Math.floor(Math.random() * 2) * 2 - 1;
    
    // Posición fija al lado de las líneas de estacionamiento según el sentido
    var pos = (dir == 1) ? 1 : 4;
    
    // Forzamos que el robot aparezca en el mismo cuadrante del estacionamiento
    car = {
      "side": parkingPos,
      "position": pos,
      "direction": dir,
    };

    for(let i = 0; i < 4; i++) {
      if(i == parkingPos) {
        let lightNo = Math.floor(Math.random() * 18);
        if(lightNo % 2) {
          lightSigns[i][Math.floor(Math.random() * 3) + 3] = Math.floor(Math.random() * 2) + 1;
        } else if(lightNo % 2 == 0) {
          lightSigns[i][3] = Math.floor(Math.random() * 2) + 1;
          lightSigns[i][5] = Math.floor(Math.random() * 2) + 1;
        }
      } else {
        let lightNo = Math.floor(Math.random() * 36);
        if(lightNo % 2) {
          lightSigns[i][Math.floor(Math.random() * 6)] = Math.floor(Math.random() * 2) + 1;
        } else if(lightNo % 2 == 0) {
          let upOrDown = Math.floor(Math.random() * 2);
          if(upOrDown == 0) 
            lightSigns[i][0] = Math.floor(Math.random() * 2) + 1;
          else
            lightSigns[i][3] = Math.floor(Math.random() * 2) + 1;

          upOrDown = Math.floor(Math.random() * 2);
          if(upOrDown == 0) 
            lightSigns[i][2] = Math.floor(Math.random() * 2) + 1;
          else
            lightSigns[i][5] = Math.floor(Math.random() * 2) + 1;
        }
      }
    }
  }
}

function renderRobot(quadrant, position, direction) {
  var robot = document.getElementById("robot");
  var robotArrow = document.getElementById("robot-arrow");

  switch(quadrant) {
    case 0:
      robot.style.setProperty('width', 'calc(30 / 320 * 100%)');
      robot.style.setProperty('height', 'calc(18 / 320 * 100%)');
      robotArrow.style.setProperty('transform', (direction == 1) ? 'rotate(90deg)' : 'rotate(-90deg)');

      if(position == 0 || (position == 1 || position == 2))
        robot.style.setProperty('left', 'calc(20 / 320 * 100% + 100 / 320 * 100%)');
      else
        robot.style.setProperty('left', 'calc(20 / 320 * 100% + 150 / 320 * 100%)');

      if(position == 0 || position == 3)
        robot.style.setProperty('top', 'calc(11 / 320 * 100% + 70 / 320 * 100%)');
      else if(position == 1 || position == 4)
        robot.style.setProperty('top', 'calc(11 / 320 * 100% + 40 / 320 * 100%)');
      else
        robot.style.setProperty('top', 'calc(11 / 320 * 100% + 10 / 320 * 100%)');
      break;

    case 1:
      robot.style.setProperty('width', 'calc(18 / 320 * 100%)');
      robot.style.setProperty('height', 'calc(30 / 320 * 100%)');
      robotArrow.style.setProperty('transform', (direction == 1) ? 'rotate(180deg)' : 'rotate(0deg)');

      if(position == 0 || (position == 1 || position == 2))
        robot.style.setProperty('top', 'calc(20 / 320 * 100% + 100 / 320 * 100%)');
      else
        robot.style.setProperty('top', 'calc(20 / 320 * 100% + 150 / 320 * 100%)');

      if(position == 0 || position == 3)
        robot.style.setProperty('left', 'calc(11 / 320 * 100% + 210 / 320 * 100%)');
      else if(position == 1 || position == 4)
        robot.style.setProperty('left', 'calc(11 / 320 * 100% + 240 / 320 * 100%)');
      else
        robot.style.setProperty('left', 'calc(11 / 320 * 100% + 270 / 320 * 100%)');
      break;
    
    case 2:
      robot.style.setProperty('width', 'calc(30 / 320 * 100%)');
      robot.style.setProperty('height', 'calc(18 / 320 * 100%)');
      robotArrow.style.setProperty('transform', (direction == 1) ? 'rotate(-90deg)' : 'rotate(90deg)');

      if(position == 0 || (position == 1 || position == 2))
        robot.style.setProperty('left', 'calc(20 / 320 * 100% + 150 / 320 * 100%)');
      else
        robot.style.setProperty('left', 'calc(20 / 320 * 100% + 100 / 320 * 100%)');

      if(position == 0 || position == 3)
        robot.style.setProperty('top', 'calc(11 / 320 * 100% + 210 / 320 * 100%)');
      else if(position == 1 || position == 4)
        robot.style.setProperty('top', 'calc(11 / 320 * 100% + 240 / 320 * 100%)');
      else
        robot.style.setProperty('top', 'calc(11 / 320 * 100% + 270 / 320 * 100%)');
      break;
    
    case 3:
      robot.style.setProperty('width', 'calc(18 / 320 * 100%)');
      robot.style.setProperty('height', 'calc(30 / 320 * 100%)');
      robotArrow.style.setProperty('transform', (direction == 1) ? 'rotate(0deg)' : 'rotate(180deg)');

      if(position == 0 || (position == 1 || position == 2))
        robot.style.setProperty('top', 'calc(20 / 320 * 100% + 150 / 320 * 100%)');
      else
        robot.style.setProperty('top', 'calc(20 / 320 * 100% + 100 / 320 * 100%)');

      if(position == 0 || position == 3)
        robot.style.setProperty('left', 'calc(11 / 320 * 100% + 70 / 320 * 100%)');
      else if(position == 1 || position == 4)
        robot.style.setProperty('left', 'calc(11 / 320 * 100% + 40 / 320 * 100%)');
      else
        robot.style.setProperty('left', 'calc(11 / 320 * 100% + 10 / 320 * 100%)');
      break;
  };
}

function renderCube(side, pos, color) {
  var cubeDiv = document.createElement("div");
  cubeDiv.classList.add("cube");
  cubeDiv.classList.add(color + "-cube");
  var top, left;

  switch(side) { 
    case 3:
      top = 195 - pos % 3 * 50;
      left = 35 + 20 * (pos > 2);
      break;
    case 0:
      top = 35 + 20 * (pos > 2);
      left = 95 + pos % 3 * 50;
      break;
    case 1:
      top = 95 + pos % 3 * 50;
      left = 255 - 20 * (pos > 2);
      break;
    case 2:
      top = 255 - 20 * (pos > 2);
      left = 95 + pos % 3 * 50;
      break;
  }
  
  cubeDiv.style.setProperty('top', 'calc(10 / 320 * 100% + ' + String(top) +' / 320 * 100%)');
  cubeDiv.style.setProperty('left', 'calc(10 / 320 * 100% + ' + String(left) +' / 320 * 100%)');
  
  document.getElementById("object-container").appendChild(cubeDiv);
}

function renderCubes() {
  for(var i = 0; i < 4; i++) {
    for(var j = 0; j  < 6; j++) {
      if(lightSigns[i][j] == 1) renderCube(i, j, 'red');
      if(lightSigns[i][j] == 2) renderCube(i, j, 'green');
    }
  }
}

function renderWalls() {
  var topWall = document.getElementById("top-wall");
  var rightWall = document.getElementById("right-wall");
  var bottomWall = document.getElementById("bottom-wall");
  var leftWall = document.getElementById("left-wall");

  topWall.style.setProperty('top', 'calc(10 / 320 * 100% + ' + String(100 - 40 * walls[0]) + ' / 320 * 100%)');
  topWall.style.setProperty('height', 'calc(4 / 320 * 100%)');
  topWall.style.setProperty('width', 'calc(' + String(100 + 40 * (walls[1] + walls[3])) + ' / 320 * 100%)');
  topWall.style.setProperty('left', 'calc(10 / 320 * 100% + ' + String(100 - 40 * walls[3]) + ' / 320 * 100%)');
  
  bottomWall.style.setProperty('top', 'calc(6 / 320 * 100% + ' + String(200 + 40 * walls[2]) + ' / 320 * 100%)');
  bottomWall.style.setProperty('height', 'calc(4 / 320 * 100%)');
  bottomWall.style.setProperty('width', 'calc(' + String(100 + 40 * (walls[1] + walls[3])) + ' / 320 * 100%)');
  bottomWall.style.setProperty('left', 'calc(10 / 320 * 100% + ' + String(100 - 40 * walls[3]) + ' / 320 * 100%)');

  rightWall.style.setProperty('left', 'calc(6 / 320 * 100% + ' + String(200 + 40 * walls[1]) + ' / 320 * 100%)');
  rightWall.style.setProperty('width', 'calc(4 / 320 * 100%)');
  rightWall.style.setProperty('height', 'calc(' + String(100 + 40 * (walls[0] + walls[2])) + ' / 320 * 100%)');
  rightWall.style.setProperty('top', 'calc(10 / 320 * 100% + ' + String(100 - 40 * walls[0]) + ' / 320 * 100%)');

  leftWall.style.setProperty('left', 'calc(10 / 320 * 100% + ' + String(100 - 40 * walls[3]) + ' / 320 * 100%)');
  leftWall.style.setProperty('width', 'calc(4 / 320 * 100%)');
  leftWall.style.setProperty('height', 'calc(' + String(100 + 40 * (walls[0] + walls[2])) + ' / 320 * 100%)');
  leftWall.style.setProperty('top', 'calc(10 / 320 * 100% + ' + String(100 - 40 * walls[0]) + ' / 320 * 100%)');
}

function renderParking() {
  var parking1 = document.getElementById("parking1");
  var parking2 = document.getElementById("parking2");

  parking1.style.setProperty('display', 'block');
  parking2.style.setProperty('display', 'block');

  if(parkingPos & 1) {
    parking1.style.setProperty('width', 'calc(20 / 320 * 100%)');
    parking1.style.setProperty('height', 'calc(2 / 320 * 100%)');
    parking2.style.setProperty('width', 'calc(20 / 320 * 100%)');
    parking2.style.setProperty('height', 'calc(2 / 320 * 100%)');
    
    if(parkingPos == 1) {
      parking1.style.setProperty('top', 'calc(10 / 320 * 100% + 100 / 320 * 100%)');
      parking2.style.setProperty('top', 'calc(10 / 320 * 100% + 137.5 / 320 * 100%)');
      parking1.style.setProperty('left', 'calc(10 / 320 * 100% + 280 / 320 * 100%)');
      parking2.style.setProperty('left', 'calc(10 / 320 * 100% + 280 / 320 * 100%)');
    } else {
      parking1.style.setProperty('top', 'calc(8 / 320 * 100% + 200 / 320 * 100%)');
      parking2.style.setProperty('top', 'calc(8 / 320 * 100% + 162.5 / 320 * 100%)');
      parking1.style.setProperty('left', 'calc(10 / 320 * 100%)');
      parking2.style.setProperty('left', 'calc(10 / 320 * 100%)');
    }
  } else {
    parking1.style.setProperty('width', 'calc(2 / 320 * 100%)');
    parking1.style.setProperty('height', 'calc(20 / 320 * 100%)');
    parking2.style.setProperty('width', 'calc(2 / 320 * 100%)');
    parking2.style.setProperty('height', 'calc(20 / 320 * 100%)');

    if(parkingPos == 0) {
      parking1.style.setProperty('top', 'calc(10 / 320 * 100%)');
      parking2.style.setProperty('top', 'calc(10 / 320 * 100%)');
      parking1.style.setProperty('left', 'calc(10 / 320 * 100% + 100 / 320 * 100%)');
      parking2.style.setProperty('left', 'calc(10 / 320 * 100% + 137.5 / 320 * 100%)');
    } else {
      parking1.style.setProperty('top', 'calc(10 / 320 * 100% + 280 / 320 * 100%)');
      parking2.style.setProperty('top', 'calc(10 / 320 * 100% + 280 / 320 * 100%)');
      parking1.style.setProperty('left', 'calc(8 / 320 * 100% + 200 / 320 * 100%)');
      parking2.style.setProperty('left', 'calc(8 / 320 * 100% + 162.5 / 320 * 100%)');
    }
  }
}

function hideParking() {
  document.getElementById("parking1").style.setProperty('display', 'none');
  document.getElementById("parking2").style.setProperty('display', 'none');
}

function saveToHistory() {
  attemptCounter++;
  var logContainer = document.getElementById("history-log");
  var emptyMsg = logContainer.querySelector(".empty-msg");
  if (emptyMsg) logContainer.innerHTML = "";

  var timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  var logCard = document.createElement("div");
  logCard.className = "log-card";
  
  logCard.setAttribute("data-round", round);
  logCard.setAttribute("data-quadrant", car.side);
  
  var totalGreen = 0, totalRed = 0;
  for(var i = 0; i < 4; i++) {
    for(var j = 0; j < 6; j++) {
      if (lightSigns[i][j] === 1) totalRed++;
      if (lightSigns[i][j] === 2) totalGreen++;
    }
  }

  var elementsText = (round == 'Cerrada') ? `${totalRed} Rojos / ${totalGreen} Verdes` : "Ninguno (Ronda Abierta)";
  var parkingText = (round == 'Cerrada') ? `Cuadrante ${parkingPos}` : "Ninguno";

  logCard.innerHTML = `
    <div class="log-header">
      <span class="log-id">#${attemptCounter}</span>
      <span class="log-time">${timeStr} - [${round}]</span>
    </div>
    <div class="log-details">
      <p><strong>Robot:</strong> Cuadrante ${car.side} - Dir: ${car.direction == 1 ? 'Horario' : 'Antihorario'}</p>
      <p><strong>Bloques:</strong> ${elementsText}</p>
      <p><strong>Estacionamiento:</strong> ${parkingText}</p>
    </div>
  `;
  logContainer.insertBefore(logCard, logContainer.firstChild);
  applyFilters();
}

function applyFilters() {
  var filterRound = document.getElementById("filter-round").value;
  var filterQuad = document.getElementById("filter-quadrant").value;
  var cards = document.querySelectorAll(".log-card");
  var visibleCount = 0;

  cards.forEach(card => {
    var matchesRound = (filterRound === "all" || card.getAttribute("data-round") === filterRound);
    var matchesQuad = (filterQuad === "all" || card.getAttribute("data-quadrant") === filterQuad);

    if (matchesRound && matchesQuad) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  var emptyMsg = document.querySelector(".filter-empty");
  if (visibleCount === 0 && cards.length > 0) {
    if (!emptyMsg) {
      var msg = document.createElement("p");
      msg.className = "empty-msg filter-empty";
      msg.innerText = "Ninguna pista coincide con los filtros.";
      document.getElementById("history-log").appendChild(msg);
    }
  } else {
    if (emptyMsg) emptyMsg.remove();
  }
}

function clearHistory() {
  attemptCounter = 0;
  document.getElementById("history-log").innerHTML = '<p class="empty-msg">No hay lanzamientos registrados aún.</p>';
}

function renderMat() {
  randomizer();
  document.querySelectorAll(".cube").forEach(element => element.remove());

  renderRobot(car.side, car.position, car.direction);
  renderWalls(); 

  if (round == 'Cerrada') {
    renderCubes();     
    renderParking();   
  } else {
    hideParking();     
  }

  saveToHistory();
}

window.onload = function() {
  renderMat();
}