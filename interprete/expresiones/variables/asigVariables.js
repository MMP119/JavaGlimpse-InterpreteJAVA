import { Entorno } from "../../patron/entorno.js";

export class AsigVariables{

    constructor(id, exp){
        this.id = id;
        this.exp = exp;
    }

    asignar(Entorno){

        const variable = Entorno.getVariable(this.id);

        if(variable.tipo === this.exp.tipo){
            return true;
        }else{
            return false;
        }

    }

}