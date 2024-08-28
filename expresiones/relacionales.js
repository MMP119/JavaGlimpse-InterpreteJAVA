export class Relacionales{

    constructor(izq, der, op){
        this.izq = izq;
        this.der = der;
        this.op = op;
    }


    ejecutar(){

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

                throw new Error("Operación no soportada en la igualdad");
            
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

                throw new Error("Operación no soportada en la desigualdad");

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

                throw new Error("Operación no soportada en la mayor que");
            
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

                throw new Error("Operación no soportada en la menor que");
            
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

                throw new Error("Operación no soportada en la mayor o igual que");
            
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

                throw new Error("Operación no soportada en la menor o igual que");

            default:
                throw new Error("Operador no soportado"); 
        }    

    }

}