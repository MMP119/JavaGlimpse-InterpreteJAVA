import {Entorno} from '../patron/entorno.js';

export class DecVariables {

    constructor(tipo, id, exp){
        this.tipo = tipo;
        this.id = id;
        this.exp = exp;
    }

    //método para verificar si una variable es una palabra reservada
    verificarReservada(node, id){

        const reservedWords = new Set([
            'abstract', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 
            'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 
            'enum', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 
            'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 
            'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 
            'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 
            'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 
            'yield', 'join', 'length', 'indexOf'
        ]);
    
        if(reservedWords.has(this.id)){
            throw new Error(`La variable ${id} es una palabra reservada\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
    
    }

    
    // Método para declarar una variable
    asignar(node){

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
                throw new Error(`Tipo de dato no soportado en variable sin expresion\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
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
                        throw new Error(`Tipo de dato incorrecto en la variable ${this.id}se esperaba un entero\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                    }
                
                case 'float':
                    
                    if(this.exp.tipo === 'float'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error(`Tipo de dato incorrecto en la variable ${this.id}se esperaba un flotante\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                    }
                
                case 'string':

                    if(this.exp.tipo === 'string'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error(`Tipo de dato incorrecto en la variable ${this.id}se esperaba una cadena\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                    }

                case 'boolean':

                    if(this.exp.tipo === 'boolean'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error(`Tipo de dato incorrecto en la variable ${this.id}se esperaba un booleano\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                    }

                case 'char':

                    if(this.exp.tipo === 'char'){
                        return {
                            tipo: this.tipo,
                            valor: this.exp.valor
                        }
                    }
                    else{
                        throw new Error(`Tipo de dato incorrecto en la variable ${this.id}se esperaba un caracter\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
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
                            throw new Error(`Tipo de dato no soportado en variable sin expresion\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                
                    }
            }
        }   

    }

}