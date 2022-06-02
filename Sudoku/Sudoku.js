class Sudoku {

    tamano;
    tamanoInterno;
    tablero;

    constructor(tamano) {
        this.tamano = tamano;
        this.tamanoInterno = 3;

        this.tablero = this.crearTablero(tamano);
    }

    realizarTurno() {
        let pos;
        let num;

        do { //Pedir una posicion váida
            pos = Posicion.pedirPosicion(this.tamano); //Pedir la posición

            if (pos == null) {
                alert("Posición inválida");
            }
        } while (pos == null);

        do { //Pedir un número válido
            num = prompt("Qué número desea colocar en " + pos.toString()); //Pedir el número

            if (isNaN(num)) {
                alert("Número inválido. La entrada debe ser un número");
            } else if (num < 1 || num > this.tamano) {
                alert("Número inválido. Debe estar entre 1 y " + this.tamano);
            }
        } while (isNaN(num) || (num < 1 || num > this.tamano));

        if (this.comprobarNumero(pos, num)) {
            this.tablero[pos.x][pos.y] = num;
            alert("El numero " + num + " SI es válido");
        } else {
            this.tablero[pos.x][pos.y] = num;
            alert("El numero " + num + " NO es válido");
        }

        this.mostrarTablero();
    }

    /**
     * Comprobar si el número se puede ingresar en la posición que se desea.
     * El número es válido si no existe en:
     * - La misma fila
     * - La misma columna
     * - El mismo cuadro interno
     * 
     * @param {Posicion} pos La posición del número a comprobar
     * @param {number} num El número que se va a comprobar
     * @returns true si el número es válido, false si no
     */
    comprobarNumero(pos, num) {
        //Comprobar la fila
        for(let x = 0; x < this.tamano; x ++) {
            if (this.tablero[x][pos.y] == num) {
                return false;
            }
        }

        //Comprobar la columna
        for(let y = 0; y < this.tamano; y ++) {
            if (this.tablero[pos.x][y] == num) {
                return false;
            }
        }

        //Comprobar el cuadro interno
        let cuadX = parseInt(pos.x / 3) * this.tamanoInterno;
        let cuadY = parseInt(pos.y / 3) * this.tamanoInterno;

        for(let x = 0; x < this.tamanoInterno; x ++) {
            for(let y = 0; y < this.tamanoInterno; y ++) {
                if (this.tablero[x + cuadX][y + cuadY] == num) {
                    return false;
                }
            }
        }

        console.log("Comprobar el cuadro interno " + cuadX + ", " + cuadY);

        return true;
    }

    mostrarTablero() {
        let texto = "   ";

        for (let x = 0; x < this.tablero[0].length; x++) {
            texto += "[" + (x + 1) + "]"; //Mostrar los números del eje x
        }

        texto += "\n";

        for (let y = 0; y < this.tablero[0].length; y++) {
            texto += (y + 1) + "  "; //Mostrar los números del eje y

            for (let x = 0; x < this.tablero[0].length; x++) {
                texto += "[" + this.tablero[x][y] + "]"; //Mostrar cada una de las casillas
            }

            texto += "\n";
        }

        console.log(texto);
    }

    /**
     * Crear un arreglo bidimensional que representa un tablero
     * 
     * @param {number} tamano Tamano del tablero
     * @returns Un arreglo bidimensional que representa el tablero inicial
     */
    crearTablero(tamano) {
        let tablero = [];

        for (let x = 0; x < tamano; x++) { //En todo lo largo
            let aux = [];

            for (let y = 0; y < tamano; y++) { //En todo lo alto
                aux.push("X"); //Agregar un caracter de casilla no atacada
            }

            tablero.push(aux);
        }

        return tablero;
    }
}
