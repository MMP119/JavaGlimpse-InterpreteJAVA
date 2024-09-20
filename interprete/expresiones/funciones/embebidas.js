import { Invocable } from "./invocable.js";
import { registrarError } from '../../global/errores.js';

class FuncionNativa extends Invocable{
    constructor(aridad, func){
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}

export const embebidas = {

    'parseInt': new FuncionNativa(1, (args) => {
        
        if(args[0].tipo !== 'string'){
            registrarError('Semántico', 'El argumento de parseInt debe ser de tipo string.', "", "");
            return {tipo: 'Error', valor: 'nulo'};
        }
        
        if (!args || args.length === 0) {
            registrarError('Semántico', 'La función parseInt requiere un argumento.', "", "");
            return { tipo: 'Error', valor: null };
        }

        const valor = parseInt(args[0].valor); 

        if(isNaN(valor)){
            registrarError('Semántico', 'No puede convertirse a int', "", "");
            return { tipo: 'Error', valor: 'nulo' };
        }

        return { tipo: 'int', valor: Math.floor(valor) }; // Devuelve el valor como entero

    }),

    'parsefloat': new FuncionNativa(1, (args) => {
        
        if(args[0].tipo !== 'string'){
            registrarError('Semántico', 'El argumento de parseFloat debe ser de tipo string.', "", "");
            return {tipo: 'Error', valor: 'nulo'};
        }
        
        if (!args || args.length === 0) {
            registrarError('Semántico', 'La función parseFloat requiere un argumento.', "", "");
            return { tipo: 'Error', valor: null };
        }

        const valor = parseFloat(args[0].valor); 

        if(isNaN(valor)){
            registrarError('Semántico', 'No puede convertirse a float', "", "");
            return { tipo: 'Error', valor: 'nulo' };
        }

        return { tipo: 'float', valor: valor }; // Devuelve el valor como flotante

    }),

    'toString': new FuncionNativa(1, (args) => {
            
        if (!args || args.length === 0) {
            registrarError('Semántico', 'La función toString requiere un argumento.', "", "");
            return { tipo: 'Error', valor: null };
        }

        return { tipo: 'string', valor: args[0].valor.toString() }; // Devuelve el valor como string

    }),

    'toLowerCase': new FuncionNativa(1, (args) => {
        
        if(args[0].tipo !== 'string'){
            registrarError('Semántico', 'El argumento de toLowerCase debe ser de tipo string.', "", "");
            return {tipo: 'Error', valor: null};
        }

        if (!args || args.length === 0) {
            registrarError('Semántico', 'La función toLowerCase requiere un argumento.', "", "");
            return { tipo: 'Error', valor: null };
        }

        return { tipo: 'string', valor: args[0].valor.toLowerCase() }; // Devuelve el valor como string

    }),

    'toUpperCase': new FuncionNativa(1, (args) => {
        
        if(args[0].tipo !== 'string'){
            registrarError('Semántico', 'El argumento de toUpperCase debe ser de tipo string.', "", "");
            return {tipo: 'Error', valor: null};
        }

        if (!args || args.length === 0) {
            registrarError('Semántico', 'La función toUpperCase requiere un argumento.', "", "");
            return { tipo: 'Error', valor: null };
        }

        return { tipo: 'string', valor: args[0].valor.toUpperCase() }; // Devuelve el valor como string

    }),


};