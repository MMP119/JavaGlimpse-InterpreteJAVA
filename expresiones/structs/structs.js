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

    //método para verificar si una variable es una palabra reservada
    verificarReservada(node, id){

        const reservedWords = new Set([
            'boolean', 'break', 'case', 'char', 'continue', 'default', 'else', 'struct', 'string', 'parseInt',
            'false', 'float', 'for','if','int','null', 'return', 'switch', 'true',  'typeof', 'var', 'void','while', 
            'join', 'length', 'indexOf', 'parsefloat', 'toString', 'toLowerCase', 'toUpperCase', 'typeof'
        ]);
    
        if(reservedWords.has(id)){
            return true;
        }else{
            return false;
        }
    
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
                console.log('valor', valor);
                nuevaInstancia.set(nombre, valor.accept(interprete));
            }
        });

        //sobreescribir con los valores proporcionados en la instancia
        args.forEach(arg => {
            const {id, valor} = arg;
            if(nuevaInstancia.propiedades.hasOwnProperty(id)){
                nuevaInstancia.set(id, valor);
            }else{
                //throw new Error(`Propiedad no encontrada: ${id}`);
                registrarError('Semántico', `Propiedad no encontrada: ${id}`, node.location.start.line, node.location.start.column);
            }
        });

        return nuevaInstancia;
        
    }


}