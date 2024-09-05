import { registrarError } from '../global/errores.js';

export class MatrizFunc {

    constructor(matriz, method, indexs, value){
        this.matriz = matriz;
        this.method = method;
        this.indexs = indexs;
        this.value = value;
    }

    ejecutar(node){
        switch(this.method){
            case 'getElement':
                return this.getElement(this.matriz, this.indexs, node);
            case 'setElement':
                return this.setElement(this.matriz, this.indexs, this.value, node);
            default:
                registrarError('Semántico', `Función de matriz no soportada: ${method}`, node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };
        }
    }

    
    setElement(matriz, indices, value, node) {
        let ref = matriz.valor;
    
        for (let i = 0; i < indices.length - 1; i++) {
            const idx = indices[i].valor;
            
            // Si la referencia actual es undefined o no es un array, se lanza un error
            if (!Array.isArray(ref[idx])) {
                console.error(`Error: El índice ${idx} está fuera de los límites en la posición ${i}`);
                registrarError('Semántico', `Índice fuera de rango en la posición ${idx}`, node.location.start.line, node.location.start.column);
                return {tipo:'Error', valor:null};
            }
            ref = ref[idx];
        }
        
        // Asignar el valor en la última posición del array
        const lastIdx = indices[indices.length - 1].valor;

        if(ref[lastIdx] === undefined){
            console.error(`Error: El índice ${indices[indices.length - 2].valor} está fuera de los límites en la posición ${indices.length - 2}`);
            registrarError('Semántico', `Índice fuera de rango en la posición ${indices[indices.length - 2].valor}`, node.location.start.line, node.location.start.column);
            return {tipo:'Error', valor:null};
        }

        ref[lastIdx] = value;
    }

    getElement(matriz, indices, node) {
        let ref = matriz.valor;
    
        for (let i = 0; i < indices.length; i++) {
            // Verificar si `ref` existe antes de intentar acceder al siguiente índice
            if (ref === undefined) {
                console.error(`Error: El índice ${indices[i].valor} está fuera de los límites en la posición ${i}`);
                registrarError('Semántico', `Índice fuera de rango en la posición ${indices[i].valor}`, node.location.start.line, node.location.start.column);
                return {tipo:'Error', valor:null}; 
            }
            ref = ref[indices[i].valor];
        }
        if(ref === undefined){
            console.error(`Error: El índice ${indices[indices.length - 1].valor} está fuera de los límites en la posición ${indices.length - 1}`);
            registrarError('Semántico', `Índice fuera de rango en la posición ${indices[indices.length - 1].valor}`, node.location.start.line, node.location.start.column);
            return {tipo:'Error', valor:null};
        }
        return ref;
    }
}