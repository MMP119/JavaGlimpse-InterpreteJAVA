import {registrarError} from '../global/errores.js';

export class Entorno {

    /**
        * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.funciones = {}; // para implementar las funciones embebidas
        this.padre = padre;
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    setVariable(nombre, {tipo, valor}, fila, columna) {
        // TODO: si algo ya está definido, lanzar error
        if(this.valores.hasOwnProperty(nombre)){
            registrarError("Semantico", `Variable ${nombre} ya definida`, fila, columna); 
            return{tipo: 'Error', valor: null};
        }
        this.valores[nombre] = {tipo, valor};
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre, fila, columna) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) return valorActual;

        if (!valorActual && this.padre) {
            return this.padre.getVariable(nombre);
        }

        //throw new Error(`Variable ${nombre} no definida`); 
        registrarError("Semantico",`Variable ${nombre} no definida`, fila, columna);
        return{tipo: 'Error', valor: null};
    }

    //para las funciones embebidas
    setFuncion(nombre, funcion, fila, columna) {
        if (this.funciones.hasOwnProperty(nombre)) {
            //throw new Error(`Función ${nombre} ya definida`);
            registrarError("Semantico",`Funcion ${nombre} ya definida`, fila, columna);
            return;
        }
        this.funciones[nombre] = funcion;
    }

    getFuncion(nombre, fila, columna) {
        const funcionActual = this.funciones[nombre];

        if (funcionActual !== undefined) return funcionActual;

        if (this.padre) {
            return this.padre.getFuncion(nombre);
        }

        //throw new Error(`Función ${nombre} no definida`);
        registrarError("Semantico",`Funcion ${nombre} no definida`, fila, columna);
        return;
    }

    /**
   * @param {string} nombre
   * @param {any} valor
   */
    assignVariable(nombre, valor, fila, columna) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) {
            this.valores[nombre] = valor;
            return;
        }

        if (!valorActual && this.padre) {
            this.padre.assignVariable(nombre, valor);
            return;
        }

        //throw new Error(`Variable ${nombre} no definida`);
        registrarError("Semantico",`Variable ${nombre} no definida`, fila, columna);
        return{tipo: 'Error', valor: null};
    }
}