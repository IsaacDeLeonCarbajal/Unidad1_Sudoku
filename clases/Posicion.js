class Posicion {
    x = 0;
    y = 0;

    /**
     * Construir una posicion a partir de dos numeros enteros.
     * 
     * Se utiliza un sistema basado en cero.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Obtener los valores de la posición.
     * 
     * @returns Una string con los valores de la posición.
     */
    toString() {
        return "(" + (this.x + 1) + ", " + (this.y + 1) + ")";
    }

    /**
     * Comparar dos posiciones y saber apuntan a la misma casilla.
     * @param {Posicion} pos La posición a comparar.
     * @returns true si los valores de ambas posiciones son iguales, false si no.
     */
    equals(pos) {
        return ((this.x == pos.x) && (this.y == pos.y));
    }
}
