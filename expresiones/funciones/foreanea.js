import { Entorno } from "../../patron/entorno.js";
import { Invocable } from "./invocable.js";
import { ExcepcionReturn } from "../operaciones/transferencia.js";
import { registrarError } from '../../global/errores.js';

export class FuncionForanea extends Invocable{

    constructor(nodo, clousure){
        super();
    


    /**
     * @type {FuncDcl}
     */
    this.nodo = nodo;


    /**
     * @type {Entorno}
     */
    this.clousure = clousure;

    }


    //método para verificar si un id es una palabra reservada
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
    
        if(reservedWords.has(id)){
            registrarError('Semántico', `El ID de la fucion ${id} es una palabra reservada`, node.location.start.line, node.location.start.column);
            return true;
        }else{
            return false;
        }
    
    }

    aridad(){
        return this.nodo.params.length;
    }

    /**
     * @type {Invocable['invocar']} 
     */
    invocar(interprete, args){
        const entornoNuevo = new Entorno(this.clousure);
        

        this.nodo.params.forEach((param, index) => {

            //verificar que el id no sea una palabra reservada
            if(this.verificarReservada(this.nodo, param.id))return;

            //verificar que el tipo de dato sea el mismo que la funcion
            if(param.tipo != args[index].tipo){
                registrarError('Semántico', `Error en la función ${this.nodo.id}, el argumento ${args[index].valor} no coincide con el tipo de dato del parámetro ${param.id} (${param.tipo})`, this.nodo.location.start.line, this.nodo.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            const {tipo, id} = param;
            const valor = args[index];

            entornoNuevo.setVariable(id, {tipo: tipo, valor: valor.valor});
        });


        const entornoAntesLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;


        try{
            this.nodo.bloque.accept(interprete);


        }catch(e){

            interprete.entornoActual = entornoAntesLlamada;

            if(e instanceof ExcepcionReturn){
                //verificar que el return sea del mismo tipo que la funcion
                if(e.value.tipo != this.nodo.tipo){
                    registrarError('Semántico', `Error en la función ${this.nodo.id}, el valor de retorno ${e.value.valor} no coincide con el tipo de dato de la función (${this.nodo.tipo})`, this.nodo.location.start.line, this.nodo.location.start.column);
                    return {tipo: 'Error', valor: null};
                }
                return e.value;
            }

            //pueden existir más excepciones, continue o brake
            throw e;
        }

        interprete.entornoActual = entornoAntesLlamada;
        return {tipo: 'Error', valor:null};

    }


}