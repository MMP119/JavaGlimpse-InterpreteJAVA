
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
            'abstract', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 
            'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 
            'enum', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 
            'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 
            'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 
            'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 
            'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 
            'yield', 'join', 'length', 'indexOf'
        ]);
    
        if(reservedWords.has(this.id)){
            registrarError('Semántico', `La variable ${id} es una palabra reservada`, node.location.start.line, node.location.start.column);
            return true;
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