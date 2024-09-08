//clase para definir todo lo que pueda ser invocable dentro de nuestro lenguaje

import { InterpreterVisitor } from "../../patron/interprete.js";
import { Entorno } from "../../patron/entorno.js";

export class Invocable {
    
    aridad(){
        throw new Error("No implementado");

    }

    /**
     * @param interprete {InterpreterVisitor}
     * @param args {any[]}
     */
    invocar(interprete, args, nombreFuncion){ // itnerprete la instancia del visitor, clousure es el entorno donde se ejecutara la funcion
        throw new Error("No implementado");
    }

}