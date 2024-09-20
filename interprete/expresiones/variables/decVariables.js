import {registrarError} from '../../global/errores.js';
import { Instancia } from '../structs/instancia.js';

export class DecVariables {

    constructor(tipo, id, exp){
        this.tipo = tipo;
        this.id = id;
        this.exp = exp;
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

    
    // Método para declarar una variable
    asignar(node){

        //primero verificar si la variable viene con un tipo de dato y sin valor
        // por ejemplo int a;
        if(this.tipo != null && this.exp.valor === null){

            if(this.tipo ==='int'){
                return {tipo: this.tipo, valor: null};
            }
            else if(this.tipo === 'float'){
                return {tipo: this.tipo, valor: null};
            }
            else if(this.tipo === 'string'){
                return {tipo: this.tipo, valor: null};
            }
            else if(this.tipo === 'boolean'){
                return {tipo: this.tipo, valor: null};
            }
            else if(this.tipo === 'char'){
                return {tipo: this.tipo, valor: null};
            }
            else if(this.tipo === 'struct'){
                return {tipo: this.tipo, valor: null};
            }
            else{
                registrarError("Semantico", "Tipo de dato no soportado", node.location.start.line, node.location.start.column);
                return {
                    tipo: 'Error',
                    valor: null
                }
            }

        }

        // verificar si ya viene con un tipo y un valor
        // por ejemplo int a = 5;

        if(this.tipo != null && this.exp != null){

            if(this.tipo != 'int' && this.tipo != 'float' && this.tipo !=' string' && this.tipo != 'boolean' && this.tipo != 'char'){
                if(this.exp instanceof Instancia){
                    return {
                        tipo: this.tipo,
                        valor: this.exp
                    }
                }
            }

            switch(this.tipo){

                case 'int':

                    if(this.exp.tipo === 'int'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }else{
                        registrarError("Semantico","Tipo de dato incorrecto en la variable, se esperaba un int", node.location.start.line, node.location.start.column);
                        return {
                            tipo: 'Error',
                            valor: null
                        }
                        //throw new Error(`Tipo de dato incorrecto en la variable ${this.id}se esperaba un entero\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                    }
                
                case 'float':
                    
                    if(this.exp.tipo === 'float' || this.exp.tipo === 'int'){
                        return {
                            tipo: this.tipo,
                            valor: parseFloat(this.exp.valor)
                        }
                    }
                    else{
                        registrarError("Semantico", "Tipo de dato incorrecto en la variable, se esperaba un float", node.location.start.line, node.location.start.column);
                        return {
                            tipo: 'Error',
                            valor: null
                        }
                    }
                
                case 'string':

                    if(this.exp.tipo === 'string'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        registrarError("Semantico", " Tipo de dato incorrecto en la variable, se esperaba un string", node.location.start.line, node.location.start.column);
                        return {
                            tipo: 'Error',
                            valor: null
                        }
                    }

                case 'boolean':

                    if(this.exp.tipo === 'boolean'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        registrarError("Semantico", " Tipo de dato incorrecto en la variable, se esperaba un boolean", node.location.start.line, node.location.start.column);
                        return {
                            tipo: 'Error',
                            valor: null
                        }
                    }

                case 'char':

                    if(this.exp.tipo === 'char'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        registrarError("Semantico", "Tipo de dato incorrecto en la variable, se esperaba un char", node.location.start.line, node.location.start.column);
                        return {
                            tipo: 'Error',
                            valor: null
                        }
                    }

                // si viene con var, entonces se debe detectar el tipo de dato
                case 'var':

                    if(this.exp instanceof Instancia){
                        return {
                            tipo: this.tipo,
                            valor: this.exp
                        }
                    }

                    switch(this.exp.tipo){

                        case 'int':
                            return {
                                tipo: 'int',
                                valor: this.exp.valor
                            }
                        
                        case 'float':
                            return {
                                tipo: 'float',
                                valor: this.exp.valor
                            }
                        
                        case 'string':
                            return {
                                tipo: 'string',
                                valor: this.exp.valor
                            }

                        case 'boolean':
                            return {
                                tipo: 'boolean',
                                valor: this.exp.valor
                            }

                        case 'char':
                            return {
                                tipo: 'char',
                                valor: this.exp.valor
                            }

                        default:
                            registrarError("Semantico", " Tipo de dato no soportado en variable con var", node.location.start.line, node.location.start.column);
                            return {
                                tipo: 'Erorr',
                                valor: null
                            }
                    }
            }
        }   

    }

}