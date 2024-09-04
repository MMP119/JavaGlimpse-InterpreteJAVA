import { registrarError } from '../global/errores.js';

export class Relacionales{

    constructor(izq, der, op){
        this.izq = izq;
        this.der = der;
        this.op = op;
    }


    ejecutar(node){

        switch(this.op){

            case '==':
                if(this.izq.tipo === 'int' && this.der.tipo === 'int'){
                    const resultado = parseInt(this.izq.valor) === parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'float'){
                    const resultado = parseFloat(this.izq.valor) === parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'int' && this.der.tipo === 'float'){
                    const resultado = parseInt(this.izq.valor) === parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'int'){
                    const resultado = parseFloat(this.izq.valor) === parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'string' && this.der.tipo === 'string'){
                    const resultado = this.izq.valor === this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'char' && this.der.tipo === 'char'){
                    const resultado = this.izq.valor === this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                registrarError('Semántico', `Operación no soportada en la igualdad`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            
            case '!=':
                if(this.izq.tipo === 'int' && this.der.tipo === 'int'){
                    const resultado = parseInt(this.izq.valor) !== parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'float'){
                    const resultado = parseFloat(this.izq.valor) !== parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'int' && this.der.tipo === 'float'){
                    const resultado = parseInt(this.izq.valor) !== parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'int'){
                    const resultado = parseFloat(this.izq.valor) !== parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'string' && this.der.tipo === 'string'){
                    const resultado = this.izq.valor !== this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'char' && this.der.tipo === 'char'){
                    const resultado = this.izq.valor !== this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                registrarError('Semántico', `Operación no soportada en la desigualdad`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};


            case '>':
                if(this.izq.tipo === 'int' && this.der.tipo === 'int'){
                    const resultado = parseInt(this.izq.valor) > parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'float'){
                    const resultado = parseFloat(this.izq.valor) > parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'int' && this.der.tipo === 'float'){
                    const resultado = parseInt(this.izq.valor) > parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'int'){
                    const resultado = parseFloat(this.izq.valor) > parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'char' && this.der.tipo === 'char'){
                    const resultado = this.izq.valor > this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                registrarError('Semántico', `Operación no soportada en la mayor que`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};

            
            case '<':
                if(this.izq.tipo === 'int' && this.der.tipo === 'int'){
                    const resultado = parseInt(this.izq.valor) < parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'float'){
                    const resultado = parseFloat(this.izq.valor) < parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'int' && this.der.tipo === 'float'){
                    const resultado = parseInt(this.izq.valor) < parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'int'){
                    const resultado = parseFloat(this.izq.valor) < parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'char' && this.der.tipo === 'char'){
                    const resultado = this.izq.valor < this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                registrarError('Semántico', `Operación no soportada en la menor que`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            
            case '>=':
                if(this.izq.tipo === 'int' && this.der.tipo === 'int'){
                    const resultado = parseInt(this.izq.valor) >= parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'float'){
                    const resultado = parseFloat(this.izq.valor) >= parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'int' && this.der.tipo === 'float'){
                    const resultado = parseInt(this.izq.valor) >= parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'int'){
                    const resultado = parseFloat(this.izq.valor) >= parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'char' && this.der.tipo === 'char'){
                    const resultado = this.izq.valor >= this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                registrarError('Semántico', `Operación no soportada en la mayor o igual que`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};

            
            case '<=':
                if(this.izq.tipo === 'int' && this.der.tipo === 'int'){
                    const resultado = parseInt(this.izq.valor) <= parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'float'){
                    const resultado = parseFloat(this.izq.valor) <= parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'int' && this.der.tipo === 'float'){
                    const resultado = parseInt(this.izq.valor) <= parseFloat(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'float' && this.der.tipo === 'int'){
                    const resultado = parseFloat(this.izq.valor) <= parseInt(this.der.valor);
                    return {tipo: 'boolean', valor: resultado};
                }

                if(this.izq.tipo === 'char' && this.der.tipo === 'char'){
                    const resultado = this.izq.valor <= this.der.valor;
                    return {tipo: 'boolean', valor: resultado};
                }

                registrarError('Semántico', `Operación no soportada en la menor o igual que`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};

            default:

                registrarError('Semántico', `Operador no soportado: ${this.op}`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};

        }    

    }

}