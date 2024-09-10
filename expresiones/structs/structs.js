import { Expresion } from '../../patron/nodos.js';
import { FuncionForanea } from '../funciones/foreanea.js';
import {Invocable} from '../funciones/invocable.js';
import { Instancia } from './instancia.js';


export class Struct extends Invocable{

    constructor(nombre, propiedades, metodos){
        super();

        /**
         * @type {string}
         */
        this.nombre = nombre;

        /**
         * @type {Map<string, Expresion>}
         */
        this.propiedades = propiedades;

        /**
         * @type {Object<string, FuncionForanea>}
         * @description Mapa de métodos del struct
         */
        this.metodos = metodos;        
    }


    /**
     * @param {string} nombre
     * @returns {FuncionForanea | null}
     */
    buscarMetodo(nombre){
        if(this.metodos.hasOwnProperty(nombre)){
            return this.metodos[nombre];
        }
        return null;
    }


    aridad() {
        const constructor = this.buscarMetodo('constructor');
        if(constructor){
            return constructor.aridad();
        }
        return 0;
    }


    /**
     * @type {Invocable['invocar']}
     */
    invocar(interprete, args, nombreFuncion) { 
        const nuevaInstancia = new Instancia(this);

        //valores default
        Object.entries(this.propiedades).forEach(([nombre, valor]) => {
            if(valor === null){
                nuevaInstancia.set(nombre, null);
            }else{
                nuevaInstancia.set(nombre, valor.accept(interprete));
            }
        });

        const constructor = this.buscarMetodo('constructor');
        if (constructor) {
            constructor.atar(nuevaInstancia).invocar(interprete, args);
        }

        return nuevaInstancia;
        
    }


}