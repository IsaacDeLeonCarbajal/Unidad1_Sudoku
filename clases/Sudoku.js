const casillaVacia = '-'; //Caracter que se muestra en las casillas vacías

class Sudoku {

    tamano;
    tamanoInterno;
    tablero;

    static numerosValidos = [4, 9, 16, 25];

    constructor() {
    }

    jugar() {
        let error; //Indica si hay error en alguno de los procesos

        do { //Pedir un tamaño de tablero válido
            error = false;

            this.tamano = parseInt(prompt("Ingrese el tamaño del tablero.\n"
                + "Debe ser uno de " + Sudoku.numerosValidos.join(", "))); //Pedir el tamaño, indicando cuáles son válidos
            
            if (isNaN(this.tamano)) { //Si no se ingresó un número
                error = true;
                alert("El tamaño debe ser un número");
            } else if (!Sudoku.numerosValidos.includes(this.tamano)) { //Si el tamaño no es válido
                error = true;
                alert("El número debe ser uno de " + Sudoku.numerosValidos.join(", ")); //Indicar cuáles son los números válidos
            }
        } while (error);

        this.tamanoInterno = Math.sqrt(this.tamano); //Calcular el tamaño de cada cuadro interno
        this.tablero = this.crearTablero(this.tamano); //Crear el tablero
        this.inicializarTablero();

        this.mostrarTablero();

        while (!this.comprobarTablero()) { //Mientras no se haya ganado
            console.log("\n\n");

            this.realizarTurno();

            this.mostrarTablero(); //Mostrar el tablero después de cada turno
        }

        alert("FELICIDADES!!!\n"
            + "Usted ha ganado");

        console.log("\n\n\n");
        console.log("FELICIDADES!!!\n"
            + "Usted ha ganado");
        this.mostrarTablero();
    }

    /**
     * Pedir al jugador que realice su turno.
     * Se le pide una posición, y un número.
     */
    realizarTurno() {
        let pos; //Posición donde se quiere colocar el número
        let num; //Número que se quiere colocar en la posición

        do { //Pedir una posicion váida
            pos = Posicion.pedirPosicion(this.tamano); //Pedir la posición

            if (pos == null) {
                alert("Posición inválida");
            }
        } while (pos == null);

        do { //Pedir un número válido
            num = prompt("Qué número desea colocar en " + pos.toString() + ", o '" + casillaVacia + "' si quiere borrar el número en la posición"); //Pedir el número

            if (num == casillaVacia) { //Borrar el número en la posicion deseada
                alert("Borrar el número en " + pos.toString());
                console.log("Eliminar el número en la posición " + pos.toString());

                this.tablero[pos.x][pos.y] = num; //Actualizar el valor del tablero en la posición deseada
                return; //No intentar comprobar el valor ingresado
            } else if (isNaN(num)) { //Si no se ingresó un número o 'X'
                alert("Entrada inválida. Debe ser un número o '" + casillaVacia + "'");
            } else if (num < 1 || num > this.tamano) { //Si el número ingresado está fuera del rango
                alert("Número inválido. Debe estar entre 1 y " + this.tamano);
            }
        } while (isNaN(num) || (num < 1 || num > this.tamano));

        if (this.validarNumero(pos, num)) { //Si el número es válido
            this.tablero[pos.x][pos.y] = parseInt(num);
            alert("El numero " + parseInt(num) + " es válido");
        } else { //Si el número no es válido
            this.tablero[pos.x][pos.y] = parseInt(num);
            alert("El numero " + parseInt(num) + " no es válido");
        }

        console.log("Ingresar el valor " + num + " en la posición " + pos.toString()); //Mostrar el valor ingresado en consola
    }

    /**
     * Comprobar si el número es válido en la posición que se desea.
     * El número es válido si no existe en:
     * - La misma fila
     * - La misma columna
     * - El mismo cuadro interno
     * 
     * @param {Posicion} pos La posición del número a validar
     * @param {number} num El número que se va a validar
     * @returns true si el número es válido, false si no
     */
    validarNumero(pos, num) {
        //Comprobar la fila
        for (let x = 0; x < this.tamano; x++) {
            if (x == pos.x) { //No comprobar la posición donde se está ingresando
                continue;
            } else if (this.tablero[x][pos.y] == num) { //Si el numero existe dentro de la misma fila
                return false; //No es válido
            }
        }

        //Comprobar la columna
        for (let y = 0; y < this.tamano; y++) {
            if (y == pos.y) { //No comprobar la posición donde se está ingresando
                continue;
            } else if (this.tablero[pos.x][y] == num) { //Si el numero existe dentro de la misma columna
                return false; //No es válido
            }
        }

        //Comprobar el cuadro interno
        let cuadX = parseInt(pos.x / this.tamanoInterno) * this.tamanoInterno; //Comenzar a comprobar desde cuadX
        let cuadY = parseInt(pos.y / this.tamanoInterno) * this.tamanoInterno; //Comenzar a comprobar desde cuadY

        for (let x = 0; x < this.tamanoInterno; x++) {
            for (let y = 0; y < this.tamanoInterno; y++) {
                if ((x + cuadX) == pos.x || (y + cuadY) == pos.y) { //No comprobar la posición donde se está ingresando
                    continue;
                } else if (this.tablero[x + cuadX][y + cuadY] == num) { //Si el numero existe dentro del cuadro interno
                    return false; //No es válido
                }
            }
        }

        // console.log("Comprobar desde " + cuadX + ", " + cuadY);

        return true; //Si se llega aquí, el número es válido
    }

    /**
     * Comprobar si el tablero está lleno y con todos los números correctos, lo que significaría que el jugador ganó.
     * 
     * @returns true si todos los números son correctos, false si no
     */
    comprobarTablero() {
        for (let x = 0; x < this.tamano; x++) {
            for (let y = 0; y < this.tamano; y++) {
                if (isNaN(this.tablero[x][y]) || !this.validarNumero(new Posicion(x, y), this.tablero[x][y])) { //Si no es un número o la validación no fue correcta
                    return false; //El tablero está incompleto
                }
            }
        }

        return true;
    }

    mostrarTablero() {
        let texto = "   ";

        for (let x = 0; x < this.tamano; x++) {
            texto += "[" + (x + 1) + "]"; //Mostrar los números del eje x
        }

        texto += "\n";

        for (let y = 0; y < this.tamano; y++) {
            texto += (y + 1) + "- "; //Mostrar los números del eje y

            for (let x = 0; x < this.tamano; x++) {
                texto += " " + this.tablero[x][y] + " "; //Mostrar cada una de las casillas
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
                aux.push(casillaVacia); //Agregar un caracter de casilla vacía
            }

            tablero.push(aux);
        }

        return tablero;
    }

    /**
     * Colocar algunos valores iniciales en el tablero
     */
    inicializarTablero() {
        let cantPistas = parseInt((this.tamano * this.tamano) * 0.21);

        for (let i = 0; i < cantPistas; i ++) {
            let pos = new Posicion(this.enteroRandom(0, this.tamano), this.enteroRandom(0, this.tamano));
            let num = this.enteroRandom(0, this.tamano) + 1;

            if (this.validarNumero(pos, num)) {
                this.tablero[pos.x][pos.y] = num;
            } else {
                i --;
            }
        }
    }

    /**
     * Generar un número entero pseudo-aleatorio
     * 
     * @param {number} min Número mínimo resultante (incluido)
     * @param {number} max Número máximo resultante (excluido)
     * @returns U número pseudo-aleatorio entre min(incluido) y max(excluido)
     */
    enteroRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
