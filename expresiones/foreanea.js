import { Entorno } from "../patron/entorno.js";
import { Invocable } from "./invocable.js";
import { ExcepcionReturn } from "./transferencia.js";

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

    aridad(){
        return this.nodo.params.length;
    }

    /**
     * @type {Invocable['invocar']} 
     */
    invocar(interprete, args){
        const entornoNuevo = new Entorno(this.clousure);
        

        this.nodo.params.forEach((param, index) => {
            entornoNuevo.setVariable(param, args[index]);
        });


        const entornoAntesLlamada = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;


        try{
            this.nodo.bloque.accept(interprete);


        }catch(e){

            interprete.entornoActual = entornoAntesLlamada;

            if(e instanceof ExcepcionReturn){
                return e.value;
            }

            //pueden existir más excepciones, continue o brake
            throw e;
        }

        interprete.entornoActual = entornoAntesLlamada;
        return {tipo: 'Error', valor:null};

    }


}