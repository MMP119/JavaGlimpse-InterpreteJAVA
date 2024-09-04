import { registrarError } from '../global/errores.js';

export class Unaria {

    constructor(exp, op) {
        this.exp = exp;
        this.op = op;
    }

    // Método para ejecutar la operación aritmética
    ejecutar(node) {

        switch (this.op) {

            case '-':

                if(this.exp.tipo === 'int' || this.exp.tipo === 'float'){
                    const resultado = -this.exp.valor;
                    return {tipo: this.exp.tipo, valor: resultado};
                }else{
                    registrarError('Semántico', `No se puede hacer una operacion unaria si no es entero o decimal`, node.location.start.line, node.location.start.column);
                    return {tipo: 'Error', valor: null};
                }

            case '!':
                
                if(this.exp.tipo === 'boolean'){
                    const resultado = !this.exp.valor;
                    return {tipo: this.exp.tipo, valor: resultado};
                }else{
                    registrarError('Semántico', `No se puede hacer una operacion unaria si no es booleano`, node.location.start.line, node.location.start.column);
                    return {tipo: 'Error', valor: null};
                }


            default:
                registrarError('Semántico', `Operador no soportado: ${this.op}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                return {tipo: 'Error', valor: null};
        }
    }
}