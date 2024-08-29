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
                    throw new Error(`No se puede hacer una operacion unaria si no es entero o decimal\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                }

            case '!':
                
                if(this.exp.tipo === 'boolean'){
                    const resultado = !this.exp.valor;
                    return {tipo: this.exp.tipo, valor: resultado};
                }else{
                    throw new Error(`No se puede hacer una operacion unaria si no es booleano\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                }


            default:
                throw new Error(`Operador no soportado: ${this.op}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
    }
}