import { Invocable } from "./invocable.js";

class FuncionNativa extends Invocable{
    constructor(aridad, func){
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}

export const embebidas = {
    'time': new FuncionNativa(() => 0, () => ({tipo: 'string', valor: new Date().toISOString()})),
    'parseInt': new FuncionNativa(1, (args) => ({tipo: 'int', valor: parseInt(args.valor)})),

    
};