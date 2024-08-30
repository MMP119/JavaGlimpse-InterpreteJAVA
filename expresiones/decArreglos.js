import { Entorno } from "../patron/entorno.js";

export class DecArreglos{


    constructor(tipo, id, exp, tipo2, id2){
        this.tipo = tipo;
        this.id = id;
        this.exp = exp;
        this.tipo2 = tipo2;
        this.id2 = id2;
        this.arregloRetorno = [];
    }

    //método para verificar si un id es una palabra reservada
    verificarReservada(node, id, id2){

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

        if(reservedWords.has(this.id2)){
            throw new Error(`La variable ${id2} es una palabra reservada\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
    
    }


    // Método para declarar un arreglo
    declarar(node){

        //primer caso, tipo2 e id2 son null
        if(this.tipo2 == null && this.id2 == null){
            //console.log(this.exp)

            for(const expresiones of this.exp){

                //verificar que la lista de expresiones sea del mismo tipo que el array
                if(expresiones.tipo != this.tipo){
                    throw new Error(`Error la lista de expresiones; no es del mismo tipo que el arreglo\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                }

                this.arregloRetorno.push(expresiones.valor);
            }

            return {tipo:this.tipo, valor: this.arregloRetorno};

        }



        //segundo caso, id2 es null
        else  if(this.id2 == null){

            //verificar que el tipo2 sea igual al tipo
            if(this.tipo != this.tipo2){
                throw new Error(`Error en la declaración de arreglos, el tipo de dato no coincide con el arreglo\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            }

            //verificar que la expresion sea un numero entero y que no sea negativo ni cero
            if(this.exp.tipo != 'int' || this.exp.valor <= 0){
                throw new Error(`Error en la declaración de arreglos, debe ser un número entero positivo y mayor a cero en el indice\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            }

            //crear un arreglo con el tamaño de la expresion y el valor por defecto segun el tipo
            switch(this.tipo){
                case 'int':
                    var arreglo = new Array(this.exp.valor).fill(Number.parseInt(0));
                    return {tipo:this.tipo, valor: arreglo};

                case 'float':
                    var arreglo = new Array(this.exp.valor).fill(Number.parseFloat(0.0));
                    return {tipo:this.tipo, valor: arreglo};

                case 'string':
                    var arreglo = new Array(this.exp.valor).fill("");
                    return {tipo:this.tipo, valor: arreglo};

                case 'boolean':
                    var arreglo = new Array(this.exp.valor).fill(false);
                    return {tipo:this.tipo, valor: arreglo};

                case 'char':
                    var arreglo = new Array(this.exp.valor).fill('\u0000');
                    return {tipo:this.tipo, valor: arreglo};

                default:
                    throw new Error(`Tipo de dato no soportado declaracion de arreglo \nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            }

        }


        //tercer caso, exp y tipo2 es null
        else if(this.exp == null && this.tipo2 == null){

            //verificar que el id2 sea del mismo tipo que el arreglo
            if(this.id2.tipo != this.tipo){
                throw new Error(`Error en la declaración de arreglos, el tipo de dato no coincide con el arreglo\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            }

            //si id2 es no iterable, lanzar error
            if(!Array.isArray(this.id2.valor)){
                throw new Error(`Error en la declaración de arreglos, el valor no es iterable\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            }

            //crear una copia del arreglo
            var arreglo = [...this.id2.valor];

            return {tipo:this.tipo, valor: arreglo};

        }

        else{
            throw new Error(`Error en la declaración de arreglos\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }

    }

}