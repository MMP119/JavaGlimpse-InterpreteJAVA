import { registrarError } from '../../global/errores.js';

export class Aritmetica {

    constructor(izq, der, op) {
        this.izq = izq;
        this.der = der;
        this.op = op;
    }

    // Método para ejecutar la operación aritmética
    ejecutar(node) {

        switch (this.op) {
            case '+':

                if((this.izq.tipo=== 'int' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseInt(this.izq.valor) + parseInt(this.der.valor);
                    return {tipo: 'int', valor: resultado};
                }

                if((this.izq.tipo === 'int' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){
                    //pasar el valor izq y der a float y retornar dos decimales
                    const resultado = parseFloat(this.izq.valor) + parseFloat(this.der.valor);
                    return {tipo: 'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseFloat(this.izq.valor) + parseFloat(this.der.valor);
                    return {tipo: 'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseFloat(this.izq.valor) + parseFloat(this.der.valor);
                    return {tipo: 'float', valor: resultado};
                }

                if((this.izq.tipo === 'string' && this.der.tipo === 'string') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = this.izq.valor + this.der.valor;
                    return {tipo: 'string', valor: resultado};
                }

                registrarError('Semántico', 'Operación no soportada en la suma', node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
                

            case '-':

                if((this.izq.tipo=== 'int' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseInt(this.izq.valor) - parseInt(this.der.valor);
                    return {tipo: 'int', valor: resultado};
                }

                if((this.izq.tipo === 'int' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){
                    //pasar el valor izq y der a float y retornar dos decimales
                    const resultado = parseFloat(this.izq.valor) - parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseFloat(this.izq.valor) - parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseFloat(this.izq.valor) - parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                registrarError('Semántico', 'Operación no soportada en la resta', node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};


            case '*':

                if((this.izq.tipo=== 'int' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseInt(this.izq.valor) * parseInt(this.der.valor);
                    return {tipo:'int', valor: resultado};
                }

                if((this.izq.tipo === 'int' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){
                    //pasar el valor izq y der a float y retornar dos decimales
                    const resultado = parseFloat(this.izq.valor) * parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseFloat(this.izq.valor) * parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){
                    const resultado = parseFloat(this.izq.valor) * parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                registrarError('Semántico', 'Operación no soportada en la multiplicación', node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};


            case '/':
                if((this.izq.tipo=== 'int' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){

                    if(parseInt(this.der.valor) === 0){
                        registrarError('Semántico', 'No se puede dividir entre 0', node.location.start.line, node.location.start.column);
                        return {tipo: 'Error', valor: null};
                    }

                    const resultado = parseInt(this.izq.valor) / parseInt(this.der.valor);
                    //retornar sin decimales ya que son enteros
                    return {tipo:'int', valor: resultado.toFixed(0)};
                }

                if((this.izq.tipo === 'int' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){

                    if(parseFloat(this.der.valor) === 0){
                        registrarError('Semántico', 'No se puede dividir entre 0', node.location.start.line, node.location.start.column);
                        return {tipo: 'Error', valor: null};                        
                    }

                    //pasar el valor izq y der a float y retornar todos los decimales
                    const resultado = parseFloat(this.izq.valor) / parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'float') && (this.izq.valor !== null && this.der.valor !== null)){

                    if(parseFloat(this.der.valor) === 0){
                        registrarError('Semántico', 'No se puede dividir entre 0', node.location.start.line, node.location.start.column);
                        return {tipo: 'Error', valor: null};
                    }

                    const resultado = parseFloat(this.izq.valor) / parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                if((this.izq.tipo === 'float' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){

                    if(parseInt(this.der.valor) === 0){
                        registrarError('Semántico', 'No se puede dividir entre 0', node.location.start.line, node.location.start.column);
                        return {tipo: 'Error', valor: null};
                    }

                    const resultado = parseFloat(this.izq.valor) / parseFloat(this.der.valor);
                    return {tipo:'float', valor: resultado};
                }

                registrarError('Semántico', 'Operación no soportada en la división', node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};


            case '%':

                if((this.izq.tipo=== 'int' && this.der.tipo === 'int') && (this.izq.valor !== null && this.der.valor !== null)){

                    if(parseInt(this.der.valor) === 0){
                        registrarError('Semántico', 'No se puede dividir entre 0', node.location.start.line, node.location.start.column);
                        return {tipo: 'Error', valor: null};
                    }

                    const resultado = parseInt(this.izq.valor) % parseInt(this.der.valor);
                    return {tipo:'int', valor: resultado};
                }

                registrarError('Semántico', 'Operación no soportada en el módulo', node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};

            default:
                registrarError('Semántico', 'Operación no soportada', node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
        }
    }
}