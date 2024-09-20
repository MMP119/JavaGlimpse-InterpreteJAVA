import { Entorno } from "../../patron/entorno.js";
import { registrarError } from '../../global/errores.js';

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


    // Método para declarar un arreglo
    declarar(node){

        //primer caso, tipo2 e id2 son null
        if(this.tipo2 == null && this.id2 == null){
            //console.log(this.exp)

            for(const expresiones of this.exp){

                //verificar que la lista de expresiones sea del mismo tipo que el array
                if(expresiones.tipo != this.tipo){
                    registrarError('Semántico', `Error la lista de expresiones; no es del mismo tipo que el arreglo`, node.location.start.line, node.location.start.column);
                    return {tipo: 'Error', valor: null};
                }

                this.arregloRetorno.push(expresiones.valor);
            }

            return {tipo:this.tipo, valor: this.arregloRetorno};

        }



        //segundo caso, id2 es null
        else  if(this.id2 == null){

            //verificar que el tipo2 sea igual al tipo
            if(this.tipo != this.tipo2){
                registrarError('Semántico', `Error en la declaración de arreglos, el tipo de dato no coincide con el arreglo`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            //verificar que la expresion sea un numero entero y que no sea negativo ni cero
            if(this.exp.tipo != 'int' || this.exp.valor <= 0){
                registrarError('Semántico', `Error en la declaración de arreglos, debe ser un número entero positivo y mayor a cero en el indice`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
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
                    registrarError('Semántico', `Tipo de dato no soportado declaracion de arreglo`, node.location.start.line, node.location.start.column);
                    return {tipo: 'Error', valor: null};
            }

        }


        //tercer caso, exp y tipo2 es null
        else if(this.exp == null && this.tipo2 == null){

            //verificar que el id2 sea del mismo tipo que el arreglo
            if(this.id2.tipo != this.tipo){
                registrarError('Semántico', `Error en la declaración de arreglos, el tipo de dato no coincide con el arreglo`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            //si id2 es no iterable, lanzar error
            if(!Array.isArray(this.id2.valor)){
                registrarError('Semántico', `Error en la declaración de arreglos, el valor no es iterable`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            //crear una copia del arreglo
            var arreglo = [...this.id2.valor];

            return {tipo:this.tipo, valor: arreglo};

        }

        else{
            registrarError('Semántico', `Error en la declaración de arreglos`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

    }

}