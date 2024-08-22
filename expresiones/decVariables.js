import {Entorno} from '../patron/entorno.js';

export class DecVariables {

    constructor(tipo, id, exp){
        this.tipo = tipo;
        this.id = id;
        this.exp = exp;
    }


    // Método para declarar una variable
    asignar(){

        //primero verificar si la variable viene con un tipo de dato y sin valor
        // por ejemplo int a;
        if(this.tipo != null && this.exp == null){

            switch(this.tipo){
                case 'int':
                    var expresion = Number.parseInt(0);
                    this.exp = expresion;
                
                case 'float':
                    this.exp = 0.0;
                
                case 'string':
                    this.exp = "";

                case 'boolean':
                    this.exp = true;

                case 'char':
                    this.exp = '';

                default:
                    throw new Error("Tipo de dato no soportado");
                
            }

        }

        // verificar si ya viene con un tipo y un valor
        // por ejemplo int a = 5;

        if(this.tipo != null && this.exp != null){

            switch(this.tipo){
                case 'int':
                    if(typeof this.exp === 'number' && Number.isInteger(this.exp)){
                        return {
                            tipo: this.tipo,
                            exp: Number.parseInt(this.exp)
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id +" se esperaba un entero");
                    }
                
                case 'float':
                    if(typeof this.exp === 'number' && String(this.exp).includes('.')){

                        return {
                            tipo: this.tipo,
                            exp: this.exp
                        };
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un flotante");
                    }
                
                case 'string':
                    if(typeof this.exp === 'string' ){

                        return {
                            tipo: this.tipo,
                            exp: this.exp
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba una cadena");
                    }

                case 'boolean':
                    if(typeof this.exp === 'boolean'){
                        // retornar  el tipo y el valor
                        return {
                            tipo: this.tipo,
                            exp: this.exp
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un booleano");
                    }

                case 'char':
                    if(typeof this.exp === 'string' && this.exp.length === 1){
                        // retornar  el tipo y el valor
                        return {
                            tipo: this.tipo,
                            exp: this.exp
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un caracter");
                    }

                // si viene con var, entonces se debe detectar el tipo de dato
                case 'var':

                    switch(typeof this.exp){
                        case 'number':
                            this.tipo = 'int';
                            return this.exp;
                        
                        case 'string' && String(this.exp).includes('.'):
                            this.tipo = 'float';
                            return this.exp;
                        
                        case 'string':
                            this.tipo = 'string';
                            return this.exp;
                        
                        case 'boolean':
                            this.tipo = 'boolean';
                            return this.exp;

                        case 'char':
                            this.tipo = 'char';
                            return this.exp;

                        default:
                            throw new Error("Tipo de dato no soportado");
                        
                    }


                default:
                    throw new Error("Tipo de dato no soportado");
                
            }

        }

    }

}