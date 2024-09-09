
import { registrarError } from '../../global/errores.js';

export class DecMatriz{

    //constructor para las matrices
    constructor(tipo, id, exp, expN, tipo2){
        this.tipo = tipo;
        this.id = id;
        this.exp = exp;
        this.expN = expN;
        this.tipo2 = tipo2;
    }

    //método para verificar si un id es una palabra reservada
    verificarReservada(node, id){

        const reservedWords = new Set([
            'boolean', 'break', 'case', 'char', 'continue', 'default', 'else', 'struct', 'string', 'parseInt',
            'false', 'float', 'for','if','int','null', 'return', 'switch', 'true',  'typeof', 'var', 'void','while', 
            'join', 'length', 'indexOf', 'parsefloat', 'toString', 'toLowerCase', 'toUpperCase', 'typeof'
        ]);
    
        if(reservedWords.has(id)){
            return true;
        }else{
            return false;
        }
    
    }

    
    // Método para declarar una matriz
    declararMatriz(node){

        //verificar si tipo2M es null, entonces es una matriz con valores de inicializacion
        if(this.tipo2 ==null){


            let matriz = this.exp;
            
            // Verifica el valor específico
            //console.log(`Valor en matriz[0][0][0]: ${matriz[1][0][1].valor}`); // Debería imprimir 1
            return { tipo: this.tipo, valor: matriz };

        }else{ //es una matriz con un tamaño especifico, exp = num y expN = arreglo de num

            const matriz = this.crearMatrizConTamanioEspecifico(node);
            return {tipo: this.tipo, valor: matriz};

        }

    }

    // Crear matriz con tamaño específico
    crearMatrizConTamanioEspecifico(node) {
        // Inicializar la matriz con tamaños especificados
        const matriz = this.crearDimension(this.exp.valor, this.expN);
        return matriz;
    }

    
    // Método recursivo para crear dimensiones
    crearDimension(tamaño, dimensionesRestantes) {
        if (dimensionesRestantes.length === 0) {
            return new Array(tamaño).fill(null).map(() => this.getValorPorDefecto(this.tipo));
        }

        const tamañoSiguiente = dimensionesRestantes[0].valor;
        const dimensionesRestantesSiguientes = dimensionesRestantes.slice(1);

        return new Array(tamaño).fill(null).map(() => this.crearDimension(tamañoSiguiente, dimensionesRestantesSiguientes));
    }

    getValorPorDefecto(tipo) {
        switch (tipo) {
            case 'int':
                return {tipo: 'int', valor: 0};
            case 'float':
                return {tipo: 'float', valor: 0.0};
            case 'string':
                return {tipo: 'string', valor: ""};
            case 'boolean':
                return {tipo: 'boolean', valor: false};
            case 'char':
                return {tipo: 'char', valor: ''};
            default:
                return {tipo: 'Error', valor: null};
        }
    }

}