export class Logicas {

    constructor(izq, der, op) {
        this.izq = izq;
        this.der = der;
        this.op = op;
    }
    
    ejecutar(node) {
        switch (this.op) {
            case '&&':
                if (this.izq.tipo === 'boolean' && this.der.tipo === 'boolean') {
                    const resultado = this.izq.valor && this.der.valor;
                    return { tipo: 'boolean', valor: resultado };
                }
                throw new Error(`Operación no soportada en el AND\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            case '||':
                if (this.izq.tipo === 'boolean' && this.der.tipo === 'boolean') {
                    const resultado = this.izq.valor || this.der.valor;
                    return { tipo: 'boolean', valor: resultado };
                }
                throw new Error(`Operación no soportada en el OR\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            case '!':
                if (this.izq.tipo === 'boolean') {
                    const resultado = !this.izq.valor;
                    return { tipo: 'boolean', valor: resultado };
                }
                throw new Error(`Operación no soportada en el NOT\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            default:
                throw new Error(`Operador no soportado: ${this.op}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
    }
}