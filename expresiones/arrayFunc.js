// ArrayFunc.js

export class ArrayFunc {

    constructor(arreglo, method, params) {
        this.arreglo = arreglo;  // El arreglo al que se aplicará la función
        this.method = method;    // El método a ejecutar (indexOf, join, length, etc.)
        this.params = params;    // Parámetros que puede recibir el método
    }

    // Método para ejecutar la función solicitada
    ejecutar(node) {
        switch (this.method) {
            case 'indexOf':
                return this.indexOfA(node, this.params);
            case 'join':
                return this.join(node);
            case 'length':
                return this.length(node);
            case 'getElement':
                return {tipo:'string', valor:'getElement'};
            case 'setElement':
                return {tipo:'string', valor:'setElement'};
            default:
                throw new Error(`Función de arreglo no soportada: ${this.method}`);
        }
    }

    // Métodos individuales para cada operación de array

    indexOfA(node, params) { //funciona
        const valor = params;
        const index = this.arreglo.valor.indexOf(valor.valor);
        return { tipo: 'int', valor: index };
    }

    join(node) { //funciona
        const joinedString = this.arreglo.valor.join(',');
        return { tipo: 'string', valor: joinedString };
    }

    length(node) { //funciona
        return { tipo: 'int', valor: this.arreglo.valor.length };
    }

    getElement(node, params) {
        const index = params;
        if (index.valor < 0 || index.valor >= this.arreglo.valor.length) {
            throw new Error(`Índice fuera de rango en la posición ${index.valor}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}`);
        }
        return { tipo: this.arreglo.tipo, valor: this.arreglo.valor[index.valor] };
    }

    setElement(node, params) {
        const index = params[0];
        const valor = params[1];


        if (index.valor < 0 || index.valor >= this.arreglo.valor.length) {
            throw new Error(`Índice fuera de rango en la posición ${index.valor}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}`);
        }
        this.arreglo.valor[index.valor] = valor.valor;
        return { tipo: this.arreglo.tipo, valor: this.arreglo.valor };
    }
}

