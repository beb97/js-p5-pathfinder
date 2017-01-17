// BASED ON :
// https://github.com/CodingTrain/AStar/
// AND
// https://www.youtube.com/watch?v=aKYlikFAV4k

// Nombre de lignes et colonnes.
var cols = 60;
var rows = 60;

var cWidth = 600;
var cHeight = 600;

var endI = 30-1;
var endJ = 30-1;

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
// L'état en cas de blocage
var hasSolution = true;


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

    // Crrer les voisins des spots
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid);
        }
    }

    // Définition des points départs et arrivée
    start = grid[startI][startJ];
    // end = grid[cols - 1][rows - 1];
    end = grid[endI][endJ];

    start.isWall = false;
    end.isWall = false;

    console.log(grid);
    openSet.push(start);

}

// La boucle P5
// While (true)
function draw() {

    background(0);

    // On parcours les éléments de l'openSet (liste des spots à analyser),
    // Tant qu'on a pas atteint l'arrivée et qu'il existe toujours des éléments dans l'openSet
    // Si l'openSet est vide et que l'on n'a pas atteint l'arrivée, il n'existe pas de chemin.

    if (openSet.length > 0) {
        var winnerIndex = 0;
        // On parcous l'openSet pour trouver le "spot" de poids 'f' le plus faible.
        // On éxécute l'algorithme en utilisant le spot de poids le plus faible.
        winnerIndex = findWinnerIndex(winnerIndex);

        // Si le spot current est l'arrivée, c'est que nous sommes arrivée !
        checkEnding(openSet[winnerIndex]);

        // Sinon, nous ne sommes pas arrivés, et nous devons continuer a parcourir le graphe.

        // On calcule maintenant l'open list les nouveaux points à analyser. C'est à dire :
        // Les voisins directs (si ils ne sont pas DEJA dans la liste des points à analyser)
        // Si les voisins y sont deja, on verifie si le chemin courrant n'est psa plus court que l'ancien existant
        generatePath(openSet[winnerIndex]);

        // Nous pouvons donc retirer le point acutel de la liste des points à analyser
        removeFromArray(openSet, openSet[winnerIndex]);
        // Et l'ajouter dans la liste des points déjà traités
        closedSet.push(openSet[winnerIndex]);

        renderGraphism(winnerIndex);

    } else {

        stopOnfaillure();
        renderGraphism(winnerIndex);
    }



} // FIN  DU DRAW() LOOP

function stopOnfaillure() {
  // No solution
  console.log('DONE:NO SOLUTION');
  hasSolution = false;
  noLoop();
}

function renderGraphism() {
  // Dessiner toutes les cases du jeu
  drawGrid();

  // if (!hasSolution) {
    drawClosedSet();
    drawOpenSet();
// }

  if (hasSolution) {
  //  retrievePath(winnerIndex);
  }

  // Dessiner le chemin le plus court
  drawPath();
  drawStartAndEnd();
}

// Récupération du chemin le plus court
// On ouvre un curseur qui part du spot acutel
// Et on remonte la liste des ancetres,
// Tant que le spot a un previous
function retrievePath(winnerIndex) {
  var temp = openSet[winnerIndex];
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

function checkEnding(winner) {
  if(winner === end ) {
      // Félicitation
      console.log('DONE');
      noLoop();
  }
}

function findWinnerIndex(winner) {
  for (var i = 0; i < openSet.length; i++) {
      // On garde l'index du spot de poids le plus faible
      if(openSet[i].f < openSet[winner].f) {
          winner = i;
      }
  }
  return winner;
}

function generatePath(current) {
  for ( var i = 0; i< current.neighbors.length;i++ ) {

      // Si le voisin n'est pas encore dans le closedSet (listes des spots déjà traités)
      // Alors on devra s'assurer qu'il sera dans la liste des spots à traiter.
      if(!closedSet.includes( current.neighbors[i])) {

          // On calcul le poids de la route vers ce voisin.
          var tempWeight = calculWeight(current, current.neighbors[i]);

          // La distance augmente donc du delta;
          var tempG = current.g + tempWeight;

          // Flag pour éventuel nouveau chemin
          var newPath = false;
          // Maintenant, on vérifie que le voisin n'est pas déjà dans la liste à traiter
          if (openSet.includes( current.neighbors[i] )) {
              // Si le voisin est deja dans l'openSet mais que la nouvelle distance est plus courte.
              if (tempG < current.neighbors[i].g) {
                // Nouveau chemin plus court
                newPath = true;
              }

          } else {
              // Nouveau chemin
              newPath = true;
              // Si le voisin n'était pas dans l'openSet
              // On ajoute ce voisin à l'openSET
              openSet.push( current.neighbors[i] );
          }

          if(newPath) {
            // On ajoute son nouveau poids
            current.neighbors[i].g = tempG;
            // On calcul le poids du chemin restant entre le voisin et la fin, selon un algo heuristique
            current.neighbors[i].h = heuristic(current.neighbors[i], end);
            // On calcul le poids total du voisin : cout acutel réel + cout restant théorique (heuristique)
            current.neighbors[i].f = current.neighbors[i].h + current.neighbors[i].g;

            // On stocke dans le voisin ce noeud courant comme étant son parent/previous
            current.neighbors[i].previous = current;
          }

          console.log(current.f,current.g,current.h);
      }
  }
}

function drawGrid() {
  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
          grid[i][j].show(color(255));
      }
  }
}

function drawPath() {
  for (var i = 0; i < path.length; i++) {
      pColor = (hasSolution)?'rgba(0,0,255,0.5)':'rgba(255,0,0,0.5)';
      path[i].show(color(pColor));
  }
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
