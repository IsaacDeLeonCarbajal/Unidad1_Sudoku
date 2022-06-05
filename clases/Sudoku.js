//Clases para el estilo CSS de cada tipo de casilla
const CLASE_CORRECTA = "casilla casilla-correcta";
const CLASE_INCORRECTA = "casilla casilla-incorrecta";
const CLASE_PISTA = "casilla casilla-pista";

class Sudoku {

    tamanoTablero;
    tamanoCaja;
    tablero;

    constructor(tamano) {
        this.nuevoJuego(tamano);
    }

    /**
     * Actualizar el tamaño del tablero, eliminar de la interfaz el tablero del juego anterior y crear y dibujar un nuevo tablero con algunos valores iniciales
     * @param {number} tamano El tamaño del tablero. Debe ser uno de 4, 9, 16, 25
     */
    nuevoJuego(tamano) {
        this.tamanoTablero = tamano; //Actualizar el tamaño del tablero
        this.tamanoInterno = Math.sqrt(this.tamanoTablero); //Calcular el tamaño de cada caja interna

        document.getElementById("div-tablero").innerHTML = ""; //Eliminar el tablero del juego anterior

        this.crearTablero(); //Crear y dibujar el tablero
        this.inicializarTablero(); //Colocar algunos valores iniciales al tablero
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
        if (isNaN(num) || (num < 1 || num > this.tamanoTablero)) { //Si el valor no es un número o está fuera del rango
            return false; //No es válido
        }

        //Comprobar la fila
        for (let x = 0; x < this.tamanoTablero; x++) {
            if (x == pos.x) { //No comprobar la posición donde se está ingresando
                continue;
            } else if (this.tablero[x][pos.y].value == num) { //Si el numero existe dentro de la misma fila
                return false; //No es válido
            }
        }

        //Comprobar la columna
        for (let y = 0; y < this.tamanoTablero; y++) {
            if (y == pos.y) { //No comprobar la posición donde se está ingresando
                continue;
            } else if (this.tablero[pos.x][y].value == num) { //Si el numero existe dentro de la misma columna
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
                } else if (this.tablero[x + cuadX][y + cuadY].value == num) { //Si el numero existe dentro del cuadro interno
                    return false; //No es válido
                }
            }
        }

        return true; //Si se llega aquí, el número es válido
    }

    /**
     * Comprobar si el tablero está lleno y con todos los números correctos, lo que significaría que el jugador ganó.
     * 
     * @returns true si todos los números son correctos, false si no
     */
    comprobarTablero() {
        for (let x = 0; x < this.tamanoTablero; x++) {
            for (let y = 0; y < this.tamanoTablero; y++) {
                let casilla = this.tablero[x][y]; //Obtener la casilla

                if (isNaN(parseInt(casilla.value)) || !this.validarNumero(new Posicion(x, y), parseInt(casilla.value))) { //Si no es un número o la validación no fue correcta
                    return false; //El tablero está incompleto
                }
            }
        }

        //Si se pasa el for anterior, el tablero está completo
        //Una vez terminado el juego, no dejar editar
        for (let x = 0; x < this.tamanoTablero; x++) {
            for (let y = 0; y < this.tamanoTablero; y++) {
                this.tablero[x][y].readOnly = true; //No dejar editar la casilla
            }
        }

        return true;
    }

    /**
     * Dibujar un arreglo bidimensional de INPUT que representa un tablero
     * 
     * @param {number} tamano Tamaño del tablero
     */
    crearTablero() {
        this.tablero = [];
        let divTablero = document.getElementById("div-tablero");

        for (let y = 0; y < this.tamanoTablero; y++) { //En todo lo alto
            let divFila = document.createElement("div");

            for (let x = 0; x < this.tamanoTablero; x++) { //En todo lo largo
                /*
                El codigo de abajo es equivalente en HTML a:
                <input type="number" class="casilla casillaCorrecta"
                    maxlength="1" max="9" min="1"
                    oninput="() => {}"
                    onfocus="() => {}">
                */
                let casilla = document.createElement("input");
                casilla.type = "number";
                casilla.maxLength = this.tamanoTablero.length;
                casilla.classList = CLASE_CORRECTA;
                casilla.min = "1";
                casilla.max = this.tamanoTablero;
                casilla.oninput = () => { //Al ingresar datos en la casilla
                    if (casilla.value.length > casilla.maxLength) { //Si se ingresa más de un caracter
                        casilla.value = casilla.value.slice(casilla.maxLength - (casilla.maxLength - 1), casilla.maxLength + 1); //Cortar la entrada, dejando sólo los últimos caracteres válidos
                    }

                    if (this.validarNumero(new Posicion(x, y), parseInt(casilla.value)) || casilla.value.length == 0) { //Si la casilla está vacía o se ingresó un número correcto
                        casilla.classList = CLASE_CORRECTA; //Actualizar el estilo de la casilla

                        if (this.comprobarTablero()) { //Si el tablero está completo
                            dlgGanador.showModal();
                        }
                    } else { //Si el número ingresado no es correcto
                        casilla.classList = CLASE_INCORRECTA; //Actualizar el estilo de la casilla
                    }
                };
                casilla.onfocus = () => { //Al seleccionar una casilla
                    /*
                    Este método se usa así porque al ingresar el valor de una casilla A, y choca con el valor de una casilla B, 
                    se cambia el estilo de la casilla A al de casilla incorrecta, 
                    pero si luego se cambia el valor de la casilla B, 
                    la casilla A debería tener el estilo de casilla correcta, cosa que no se hace.
                    Es por ello que se actualiza el estilo de la csailla A al momento de seleccionarla.
                    */
                    if (casilla.readOnly == true) { //Si la casilla es de sólo lectura
                        return; //No hacer nada con ella
                    }

                    if (this.validarNumero(new Posicion(x, y), parseInt(casilla.value)) || casilla.value.length == 0) { //Si la casilla está vacía o se ingresó un número correcto
                        casilla.classList = CLASE_CORRECTA; //Actualizar el estilo de la casilla
                    } else { //Si el número ingresado no es correcto
                        casilla.classList = CLASE_INCORRECTA; //Actualizar el estilo de la casilla
                    }
                };

                divFila.insertAdjacentElement("beforeend", casilla);

                if (this.tablero[x]) { //Si existe el arreglo para esta columna
                    this.tablero[x].push(casilla); //Agregar el nuevo elemento al arreglo ya existente
                } else { //Si no existe el arreglo para esta columna
                    this.tablero.push([casilla]); //Agregar un nuevo arreglo con el nuevo valor
                }
            }

            divTablero.insertAdjacentElement("beforeend", divFila);
        }

        return this.tablero;
    }

    /**
     * Colocar algunos valores iniciales en el tablero
     */
    inicializarTablero() {
        let cantPistas = parseInt((this.tamanoTablero * this.tamanoTablero) * 0.21); //Calcular la cantidad de pistas a ingresar

        for (let i = 0; i < cantPistas; i++) {
            let pos = new Posicion(this.enteroRandom(0, this.tamanoTablero), this.enteroRandom(0, this.tamanoTablero)); //Generar una posición aleatoria
            let num = this.enteroRandom(0, this.tamanoTablero) + 1; //Generar un número aleatorio
            let casilla = this.tablero[pos.x][pos.y]; //Obtener la casilla

            if (this.validarNumero(pos, num) && (!this.tablero[pos.x][pos.y].readOnly)) { //Si el numero es válido
                casilla.value = num; //Actualizar el valor de la casilla
                casilla.readOnly = true; //Hacer que no se pueda editar la casilla
                casilla.classList = CLASE_PISTA; //Actualizar el estilo de la casilla
            } else { //Si el número no es válido
                i--; //Volver a intentar
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
