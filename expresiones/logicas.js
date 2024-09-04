import { registrarError } from '../global/errores.js';

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
                registrarError('Semántico', `Operación no soportada en el AND`, node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };

            case '||':
                if (this.izq.tipo === 'boolean' && this.der.tipo === 'boolean') {
                    const resultado = this.izq.valor || this.der.valor;
                    return { tipo: 'boolean', valor: resultado };
                }
                registrarError('Semántico', `Operación no soportada en el OR`, node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };

            case '!':
                if (this.izq.tipo === 'boolean') {
                    const resultado = !this.izq.valor;
                    return { tipo: 'boolean', valor: resultado };
                }
                registrarError('Semántico', `Operación no soportada en el NOT`, node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };

            default:
                registrarError('Semántico', `Operador no soportado: ${this.op}`, node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };

        }
    }
}