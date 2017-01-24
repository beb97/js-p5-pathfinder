// BASED ON :
// https://github.com/CodingTrain/AStar/
// AND
// https://www.youtube.com/watch?v=aKYlikFAV4k

// Nombre de lignes et colonnes.
var cols = 40;
var rows = 40;

var cWidth = 600;
var cHeight = 600;

var endI = cols-1;
var endJ = rows-1;

var startI = 0;
var startJ = 0;

var grid = new Array(cols);
// La taille en pixel des "spots"
var w,h;

// La liste des spots encore à évaluer
var openSet = new Array();
// La liste des spots déjà visités/évalués
var closedSet = new Array();
// La liste des solutions
var path = new Array();
// Le spot actuel
var current;
// L'état en cas de blocage
var hasSolution = false;


// Le point de départ de recherche
var start;
// Le point d'arrivée
var end;

//Le canevas, ne pas le bouger
var cnv;

// L'init P5
function setup() {
    cnv = createCanvas(cWidth,cHeight);
    console.log('A*');
    centerCanvas();

    // On calcul les dimensions de chaque spot
    // (-1 : 1 pixel de rab pour les marges)
    w = (width-1) / cols;
    h = (height-1) / rows;

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // Creer les spots
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {

            grid[i][j] = new Spot(i,j);

        }
    }
    // Définition des points départs et arrivée
    start = grid[startI][startJ];
    // end = grid[cols - 1][rows - 1];
    end = grid[endI][endJ];
    // debut et fin ne sont pas des walls
    start.isWall = false;
    end.isWall = false;

    // Crrer les voisins des spots
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    // Definition du current
    openSet.push(start);
    current = start;
}

// La boucle P5
// While (true)
function draw() {

    // On parcours les éléments de l'openSet (liste des spots à analyser),
    // Tant qu'on a pas atteint l'arrivée et qu'il existe toujours des éléments dans l'openSet
    // Si l'openSet est vide et que l'on n'a pas atteint l'arrivée, il n'existe pas de chemin.

    if (openSet.length > 0 && !isEndReached()) {
        // On parcous l'openSet pour trouver le "spot" de poids 'f' le plus faible.
        // On éxécute l'algorithme en utilisant le spot de poids le plus faible.
        current = findWinner();

        // Sinon, nous ne sommes pas arrivés, et nous devons continuer a parcourir le graphe.

        // On calcule maintenant l'open list les nouveaux points à analyser. C'est à dire :
        // Les voisins directs (si ils ne sont pas DEJA dans la liste des points à analyser)
        // Si les voisins y sont deja, on verifie si le chemin courrant n'est psa plus court que l'ancien existant
        generatePath();

        // Nous pouvons donc retirer le point acutel de la liste des points à analyser
        removeFromArray(openSet, current);
        // Et l'ajouter dans la liste des points déjà traités
        closedSet.push(current);

    } else {
        // Jeu fini
        console.log('FINI !' );
        console.log('Un chemin est trouvé ? ', hasSolution);
        noLoop();
    }
    renderGraphism();



} // FIN  DU DRAW() LOOP



// Récupération du chemin le plus court
// On ouvre un curseur qui part du spot acutel
// Et on remonte la liste des ancetres,
// Tant que le spot a un previous
function retrievePath() {
  var temp = current;
  // On reset l'ancien chemin le plus court
  path = [];
  // Qui est le début (ou plutot fin) du chemin le plus court
  path.push(temp);
  while (temp.previous) {
      // On stocke l'ancêtre.
      path.push(temp.previous);
      // Puis on déplace le curseur sur cet ancetre
      temp = temp.previous;
    }
}

function isEndReached() {
  var isEndReached = false;
  if(current === end ) {
      isEndReached = true;
      hasSolution = true;
  }
  return isEndReached;
}

function findWinner() {
  var winnerIndex = 0;
  for (var i = 0; i < openSet.length; i++) {
      // On garde l'index du spot de poids le plus faible
      if(openSet[i].f < openSet[winnerIndex].f) {
          winnerIndex = i;
      }
  }
  return openSet[winnerIndex];
}

function generatePath() {
  // On parcours les voisins du sport courant
  for ( var i = 0; i< current.neighbors.length;i++ ) {
      updateNeighbor(current.neighbors[i]);
  }
}

function updateNeighbor(neighbor) {
// Si le voisin n'est pas encore dans le closedSet (listes des spots déjà traités)
// Alors on devra s'assurer qu'il sera dans la liste des spots à traiter.
  if(!closedSet.includes( neighbor )) {
  // On calcul le poids de la route vers ce voisin.
    var tempWeight = calculWeight(current, neighbor);

    // La distance augmente donc du delta;
    var tempG = current.g + tempWeight;

    // Flag pour éventuel nouveau chemin
    var newPath = false;
    // Maintenant, on vérifie que le voisin n'est pas déjà dans la liste à traiter
    if (openSet.includes( neighbor )) { // Le voisin est deja dans l'openSet
        //  Mais la nouvelle distance est plus courte.
        if (tempG < neighbor.g) {
          // Nouveau chemin plus court
          newPath = true;
        }
    } else { // Le voisin n'est pas deja dans l'openSet
        // Si le voisin n'était pas dans l'openSet
        // On ajoute ce voisin à l'openSET
        openSet.push( neighbor );
        // Nouveau chemin
        newPath = true;
    }

    if(newPath) {
      // On ajoute son nouveau poids
      neighbor.g = tempG;
      // On calcul le poids du chemin restant entre le voisin et la fin, selon un algo heuristique
      neighbor.h = heuristic(neighbor, end);
      // On calcul le poids total du voisin : cout acutel réel + cout restant théorique (heuristique)
      neighbor.f = neighbor.h + neighbor.g;

      // On stocke dans le voisin ce noeud courant comme étant son parent/previous
      neighbor.previous = current;
    }
  }
}

function renderGraphism() {

  background(255);
  // Dessiner toutes les cases du jeu
  // drawGrid();
  drawWall();

  // if (!hasSolution) {
    drawClosedSet();
// }

  if (hasSolution) {
   retrievePath();
 } else {
   drawOpenSet();
 }

  // Dessiner le chemin le plus court
  drawStartAndEnd();
  drawPath();
}

function drawGrid() {
  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
          grid[i][j].show(color(255));
      }
  }
}
function drawWall() {
  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        if(grid[i][j].isWall) {
            grid[i][j].show(color(125));
          }
      }
  }
}

function drawPath() {
  // console.log('drawPath');
  // noFill();
  stroke(0,0,255);
  strokeWeight(2);
  noFill();
  beginShape();
  for (var i = 0; i < path.length; i++) {
      x = (path[i].i * w) + w/2;
      y = (path[i].j * h) + h/2;
      vertex(x, y);
  }
  endShape();

}

function drawStartAndEnd() {
  start.show(color( 0 ));
  end.show(color( 0 ));
}

   // Dessiner les éléments à visiter
 function drawOpenSet() {

   for (var i = 0; i < openSet.length; i++) {
       openSet[i].show(color( 255,0,0 ));
   }
 }

// Dessiner les élements déjà visités
 function drawClosedSet() {
   for (var i = 0; i < closedSet.length; i++) {
       closedSet[i].show(color( 0,255,0 ));
   }
 }

// Supprimer un élément d'une liste
// arr : la liste
// element : l'element a supprimer
function removeFromArray(arr, element) {
    // On part de la fin, because reasons
    for (var i = arr.length-1; i>=0 ; i--) {
        if(arr[i] == element) {
            arr.splice(i,1);
        }
    }
}

// On vérifie la présence d'un élément dans la liste
// arr : la liste
// element : l'element a vérifier
function includes(arr, element) {
    for (var i = arr.length-1; i>=0 ; i--) {
        if(arr[i] == element) {
            arr.splice(i,1);
        }
    }
}

// Le concept est d'estimer simplement la distance entre deux points.
// Il existe plusieurs implémentations d'heuristiques,
// La plus simple : distance euclidienne entre les 2 points
function heuristic(a, b) {

    // *** Euclidienne ***
    // var d = dist(a.i, a.j, b.i, b.j);

    // *** Manathan ? ***
    var d = abs(a.i - b.i) + abs(a.j - b.j);

    // *** Aucune heuristique ***
    // d = 0;

    return d;
}

// Le poids d'une route dépend de la distance qu'elle permet de parcourir
// Si on se déplace sur un axe seuleument (droit) la route est plus courte de 1
// Si on se déplace sur deux axes en même temps (diagonale) la route est plus courte de 2
function calculWeight(a, b) {
    var weight = 1;
    // if (a.i != b.i) {weight = weight - 0.75}
    // if (a.j != b.j) {weight = weight - 0.75}
    return weight;
}

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function windowResized() {
    centerCanvas();
}
