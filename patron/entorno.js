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
    setVariable(nombre, {tipo, valor}) {
        // TODO: si algo ya está definido, lanzar error
        if(this.valores.hasOwnProperty(nombre)){
            registrarError("Semantico: Variable ya definida", "", "");
            return{tipo: 'Error', valor: null};
        }
        this.valores[nombre] = {tipo, valor};
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) return valorActual;

        if (!valorActual && this.padre) {
            return this.padre.getVariable(nombre);
        }

        //throw new Error(`Variable ${nombre} no definida`); 
        registrarError("Semantico: Variable no definida", "", "");
        return{tipo: 'Error', valor: null};
    }

    //para las funciones embebidas
    setFuncion(nombre, funcion) {
        if (this.funciones.hasOwnProperty(nombre)) {
            //throw new Error(`Función ${nombre} ya definida`);
            registrarError("Semantico: Función ya definida", "", "");
            return;
        }
        this.funciones[nombre] = funcion;
    }

    getFuncion(nombre) {
        const funcionActual = this.funciones[nombre];

        if (funcionActual !== undefined) return funcionActual;

        if (this.padre) {
            return this.padre.getFuncion(nombre);
        }

        //throw new Error(`Función ${nombre} no definida`);
        registrarError("Semantico: Función no definida", "", "");
        return;
    }

    /**
   * @param {string} nombre
   * @param {any} valor
   */
    assignVariable(nombre, valor) {
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
        registrarError("Semantico: Variable no definida", "", "");
        return{tipo: 'Error', valor: null};
    }
}