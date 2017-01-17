/**
 * Created by pbebon on 17/01/2017.
 */

function Spot(i, j) {
    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.i = i;
    this.j = j;

    this.neighbors = [];
    this.previous;

    this.show = function (color) {
        fill(color);
        // La couleur du contour
        stroke(0);
        // L'épaisseur du contour (px)
        strokeWeight(1);
        // On set les dimensions du rectangle
        rect(this.i * w, this.j * h, w, h);
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
        if(!this.isOnEdge(di, dj)) {
            this.neighbors.push(grid[this.i + di] [this.j + dj]);
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
            this.setNeighbors(grid, 1, 0);
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