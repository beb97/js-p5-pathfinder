/**
 * Created by pbebon on 17/01/2017.
 */

function Spot(i, j) {
    // Poids théorique total du spot par la route la plus courte du début à la fin
    this.f = 0;
    // Poids réel du spot par la route la plus courte depuis le début
    this.g = 0;
    // Poids estimé du spot par la route la plus courte jusqu'a la fin
    this.h = 0;

    this.i = i;
    this.j = j;

    this.wallProbabilty = 0.45;
    this.isWall = false;

    this.neighbors = [];
    this.previous;

    this.isWall = ( random()>this.wallProbabilty ) ? false:true;

    this.show = function (pColor, strokeW = 0) {

        fill(pColor);
        // La couleur du contour
        stroke(0);
        // blendMode(MULTIPLY); //https://p5js.org/reference/#/p5/blendMode
        // L'épaisseur du contour (px)
        strokeWeight(strokeW);
        // On set les dimensions du rectangle
        rect(this.i * w, this.j * h, w+1, h+1);
    };

    // On ajoute tout les voisins possibles
    this.addNeighbors = function (grid) {
        // DIRECTS
        this.addDirectNeighbors(grid);
        // DIAGONNALES
        this.addDiagonalNeighbors(grid);
    };

    // Ajouts des voisins (a une distance de 1)
    this.setNeighbors = function (grid, di, dj) {
      var potentialNeighbor;
      // On n'ajoute pas les cases en dehors de la grid
        if(!this.isOnEdge(di, dj)) {
          potentialNeighbor = grid[this.i + di] [this.j + dj];
          // On n'ajoute pas les murs
          if (!potentialNeighbor.isWall) {
            this.neighbors.push(potentialNeighbor);
          }
        }
    };

    // On n'ajoute pas de voisins hors du périmètre
    this.isOnEdge = function (di, dj) {
        var isOnEdge = false;
        isOnEdge = this.isOnEdgeX(di,dj) || this.isOnEdgeY(di,dj);
        return isOnEdge;
    };

    // On verifie le bord X
    this.isOnEdgeX = function (di, dj) {
        var isOnEdgeX = false;
        if(di == -1 && this.i == 0) {
            // au debut
            isOnEdgeX = true;
        } else if(di == 1 && this.i == cols - 1) {
            // a la fin
            isOnEdgeX = true;
        }
        return isOnEdgeX;
    };

    // On verifie le bord Y
    this.isOnEdgeY = function (di, dj) {
        var isOnEdgeY = false;
        if(dj == -1 && this.j == 0) {
            isOnEdgeY = true;
        } else if(dj == 1 && this.j == rows - 1) {
            isOnEdgeY = true;
        }
        return isOnEdgeY;
    };

    this.addDirectNeighbors = function (grid) {
            this.setNeighbors(grid, 1, 0); //
            this.setNeighbors(grid, 0, 1);
            this.setNeighbors(grid, -1, 0);
            this.setNeighbors(grid, 0, -1);
    };

    this.addDiagonalNeighbors = function (grid) {
            this.setNeighbors(grid, 1, 1);
            this.setNeighbors(grid, -1, 1);
            this.setNeighbors(grid, 1, -1);
            this.setNeighbors(grid, -1, -1);;
    };

}
