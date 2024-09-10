import { registrarError } from "../../global/errores.js";
import { Struct } from "./structs.js";


export class Instancia {

    constructor(clase){
        /**
         * @type {Struct}
         */
        this.clase = clase;
        this.propiedades = {};
    }


    set(nombre, valor) {
        this.propiedades[nombre] = valor;
    }

    get(nombre, node) {
        if (this.propiedades.hasOwnProperty(nombre)) {
            return this.propiedades[nombre];
        }

        const metodo = this.clase.buscarMetodo(nombre);
        if (metodo) {
            return metodo.atar(this);
        }

        //throw new Error(`Propiedad no encontrada: ${nombre}`);
        registrarError('Semántico', `Propiedad no encontrada: ${nombre}`, node.location.start.line, node.location.start.column);
        return null;

    }

}