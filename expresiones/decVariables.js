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
        if(this.tipo != null && this.exp.valor == null){

            if(this.tipo ==='int'){
                var expresion = Number.parseInt(0);
                this.exp = {tipo: this.tipo, valor: expresion};
            }
            else if(this.tipo === 'float'){
                var expresion = Number.parseFloat(0.0);
                this.exp = {tipo: this.tipo, valor: expresion};
            }
            else if(this.tipo === 'string'){
                this.exp = {tipo: this.tipo, valor: ""};
            }
            else if(this.tipo === 'boolean'){
                this.exp = {tipo: this.tipo, valor: true};
            }
            else if(this.tipo === 'char'){
                this.exp = {tipo: this.tipo, valor: ''};
            }
            else{
                throw new Error("Tipo de dato no soportado en variable sin expresion");
            }

        }

        // verificar si ya viene con un tipo y un valor
        // por ejemplo int a = 5;

        if(this.tipo != null && this.exp != null){

            switch(this.tipo){

                case 'int':

                    if(this.exp.tipo === 'int'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un entero");
                    }
                
                case 'float':
                    
                    if(this.exp.tipo === 'float'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un flotante");
                    }
                
                case 'string':

                    if(this.exp.tipo === 'string'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba una cadena");
                    }

                case 'boolean':

                    if(this.exp.tipo === 'boolean'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un booleano");
                    }

                case 'char':

                    if(this.exp.tipo === 'char'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error("Tipo de dato incorrecto en la variable " + this.id+" se esperaba un caracter");
                    }

                // si viene con var, entonces se debe detectar el tipo de dato
                case 'var':

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
                            throw new Error("Tipo de dato no soportado");
                
                    }
            }
        }   

    }

}