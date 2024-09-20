import {Entorno} from './entorno.js'
import {BaseVisitor} from './visitor.js'
import nodos, {Expresion} from './nodos.js';
import {ExcepcionBrake, ExcepcionContinue, ExcepcionReturn} from '../expresiones/operaciones/transferencia.js';
import { registrarError } from '../global/errores.js';
import {Invocable} from '../expresiones/funciones/invocable.js';
import {embebidas} from '../expresiones/funciones/embebidas.js';
import {Aritmetica} from '../expresiones/operaciones/aritmeticas.js';
import {DecVariables} from '../expresiones/variables/decVariables.js';
import {DecArreglos} from '../expresiones/arrays/decArreglos.js';
import {Relacionales} from '../expresiones/operaciones/relacionales.js';
import {Logicas} from '../expresiones/operaciones/logicas.js';
import {Unaria} from '../expresiones/operaciones/Unaria.js';
import {AsigVariables} from '../expresiones/variables/asigVariables.js';
import {ArrayFunc} from '../expresiones/arrays/arrayFunc.js';
import { DecMatriz } from '../expresiones/matrices/decMatriz.js';
import { MatrizFunc } from '../expresiones/matrices/matrizFunc.js';
import { FuncionForanea } from '../expresiones/funciones/foreanea.js';
import { Struct } from '../expresiones/structs/structs.js';
import { Instancia } from '../expresiones/structs/instancia.js';
import { agregarSimbolo } from '../global/simbolos.js';

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno('Global'); //este es el entorno global, se inicia el visitor
        this.salida = '';

        // funciones embebidas
        Object.entries(embebidas).forEach(([nombre, funcion]) => {

            if(nombre === 'parseInt'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }else if(nombre === 'parsefloat'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }else if(nombre === 'toString'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }else if(nombre === 'toLowerCase'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }else if(nombre === 'toUpperCase'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }else if(nombre === 'typeof'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }else if(nombre === 'time'){
                this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            }




            //let tipo = funcion.invocar().tipo;
            //this.entornoActual.setFuncion(nombre, {tipo:'funcion', valor:funcion}, "", "");
            //console.log(`Función embebida: ${nombre}`, funcion.invocar());  // Imprime para verificar que las funciones están siendo añadidas correctamente
        });

        //para los errores
        this.errores = []; //almacenar los errores+


        /**
         * @type {Expresion|null}
         */
        this.antesContinue = null;

    }



    /**
      * @type {BaseVisitor['visitOperacionBinaria']}
      */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        if (['+', '-', '*', '/', '%'].includes(node.op)) {
            const aritmetica = new Aritmetica(izq, der, node.op);
            return aritmetica.ejecutar(node);
        } else if (['==', '!=', '<', '<=', '>', '>='].includes(node.op)) {
            const relacionales = new Relacionales(izq, der, node.op);
            return relacionales.ejecutar(node);
        } else if (['&&', '||', '!'].includes(node.op)) {
            const logicas = new Logicas(izq, der, node.op);
            return logicas.ejecutar(node);
        } else {
            registrarError("Semantico",`Operador desconocido: ${node.op}`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }
    }



    /**
      * @type {BaseVisitor['visitOperacionUnaria']}
      */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);
        const unaria = new Unaria(exp, node.op);
        return unaria.ejecutar(node);

    }



    /**
      * @type {BaseVisitor['visitAgrupacion']}
      */
    visitAgrupacion(node) {
        return node.exp.accept(this);
    }



    /**
      * @type {BaseVisitor['visitNumero']}
      */
    visitNumero(node) {
        //retornar el tipo y el valor
        return {tipo: node.tipo, valor: node.valor};
    }



    /**
     * @type {BaseVisitor['visitCadena']}
     */
    visitCadena(node){
        return {tipo: node.tipo, valor: node.valor};
    }    



    /**
     * @type {BaseVisitor['visitBooleano']}
     *  
     */
    visitBooleano(node){
        return {tipo: node.tipo, valor: node.valor};
    }



    //para las declaraciones de las variables
    /**
     * @type {BaseVisitor['visitDeclaracionTipoVariable']} 
     */
    visitDeclaracionTipoVariable(node) {
        const nombreVariable = node.id;
        const valorVariable = node.exp ? node.exp.accept(this): {tipo: node.tipo, valor: null};
        const tipoVariable = node.tipo;

        const declararVariable = new DecVariables(tipoVariable, nombreVariable, valorVariable);

        //verificar si la variable es una palabra reservada
        if(declararVariable.verificarReservada(node, nombreVariable)) {
            registrarError("Semantico",`El ID de la variable ${nombreVariable} es una palabra reservada`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        };

        const {tipo, valor} = declararVariable.asignar(node);

        this.entornoActual.setVariable(nombreVariable, {tipo, valor}, node.location.start.line, node.location.start.column);

    }



    
    /**
     * @type {BaseVisitor['visitDeclaracionArreglo']}
     */
    visitDeclaracionArreglo(node){

        const idArreglo1 = node.id;
        const tipoArreglo1 = node.tipo;

        //verificar si node.exp es un arreglo o no
        let expresion = null;
        if(Array.isArray(node.exp)){
            expresion = node.exp.map(exp => exp.accept(this));
        }
        if(!Array.isArray(node.exp) && node.exp != null){
            expresion = node.exp.accept(this);
        }

        const tipoArreglo2 = node.tipo2;
        const idArreglo2 = node.id2 ? node.id2.accept(this): node.id2;

        const declararArreglo = new DecArreglos(tipoArreglo1, idArreglo1, expresion, tipoArreglo2, idArreglo2);

        if(declararArreglo.verificarReservada(node, idArreglo1, idArreglo2)) {
            registrarError("Semantico",`El ID de la variable ${idArreglo1} es una palabra reservada`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        };

        const {tipo, valor} = declararArreglo.declarar(node);
        //console.log(valor[3]); //prueba de impresion de un valor de un arreglo en una posicion especifica
        
        this.entornoActual.setVariable(idArreglo1, {tipo, valor}, node.location.start.line, node.location.start.column);

    }



    /**
     * @type {BaseVisitor['visitDeclaracionMatriz']}
     */
    visitDeclaracionMatriz(node){

        const idMatriz = node.id;

        //verificar si exp y expN es un arreglo
        let exp = null;
        let expN = null;

        if(!Array.isArray(node.exp) && Array.isArray(node.expN)){ //son numeros entonces es una matriz con tamaño definido,  int [][] mtz = new int [numero][numero]
            exp = node.exp.accept(this);
            expN = node.expN

            let expNAcceps;
            if(Array.isArray(expN)){
                expNAcceps = expN.map(expN => expN.accept(this));
            }

            if(exp.tipo != 'int'){
                registrarError("Semantico",`Los valores de la matriz deben ser de tipo entero`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            //ahora verificar para expN que es un arreglo de numeros
            for(const expresion of expNAcceps){
                if(expresion.tipo != 'int'){
                    registrarError("Semantico",`Los valores de la matriz deben ser de tipo entero`, node.location.start.line, node.location.start.column);
                    return {tipo: 'Error', valor: null};
                }
            }

            if(exp.valor <= 0 ){
                registrarError("Semantico",`Los valores de la matriz deben ser mayores a cero`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            for(const expresion of expNAcceps){
                if(expresion.valor <= 0){
                    registrarError("Semantico",`Los valores de la matriz deben ser mayores a cero`, node.location.start.line, node.location.start.column);
                    return {tipo: 'Error', valor: null};
                }
            }

            if(node.tipo != node.tipo2){
                registrarError("Semantico",`El tipo de dato de la matriz es diferente al tipo de dato que se quiere implementar en la matriz`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            const declararMatriz = new DecMatriz(node.tipo, idMatriz, exp, expNAcceps, node.tipo2);
            if(declararMatriz.verificarReservada(node, idMatriz)) {
                registrarError("Semantico",`El ID de la variable ${idMatriz} es una palabra reservada`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            };

            const {tipo, valor} = declararMatriz.declararMatriz(node);

            this.entornoActual.setVariable(idMatriz, {tipo, valor}, node.location.start.line, node.location.start.column);


        }else{

            let expAccept;
            
            // Función recursiva para aceptar arreglos de cualquier dimensión
            const aceptarArreglo = (arr, tipos) => {
                if (Array.isArray(arr)) {
                    // Si es un arreglo, aplicar recursivamente la misma función para cada elemento
                    return arr.map(subElemento => aceptarArreglo(subElemento, tipos));
                } else {
                    const valor = arr.accept(this);
                    if(valor.tipo != tipos){
                        registrarError("Semantico",`Los valores de la matriz deben ser de tipo ${tipos}`, node.location.start.line, node.location.start.column);
                        return {tipo: 'Error', valor: null};
                    }
                    // Si es un elemento base (no un arreglo), aceptar el valor
                    return valor;
                }
            }

            const tipoMatriz = node.tipo;

            // Verificar si node.exp es un arreglo de múltiples dimensiones y procesarlo recursivamente
            if (Array.isArray(node.exp)) {
                expAccept = aceptarArreglo(node.exp, tipoMatriz);
            }

            const declararMatriz = new DecMatriz(node.tipo, idMatriz, expAccept, node.expN, node.tipo2);
            if(declararMatriz.verificarReservada(node, idMatriz)) {
                registrarError("Semantico",`El ID de la variable ${idMatriz} es una palabra reservada`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            };

            const {tipo, valor} = declararMatriz.declararMatriz(node);
            this.entornoActual.setVariable(idMatriz, {tipo, valor}, node.location.start.line, node.location.start.column);
            
        }
        
    }

    /**
      * @type {BaseVisitor['visitMatrizFunc']}
      */
    visitMatrizFunc(node){
        const id = node.id;
        const method = node.method;
        const indices = node.indexs;
        const value = node.value ? node.value.accept(this): null;

        const matriz = this.entornoActual.getVariable(id, node.location.start.line, node.location.start.column);

        if(!matriz){
            //throw new Error(`La matriz '${id}' no existe en el entorno actual\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`La matriz '${id}' no existe en el entorno actual`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        let indiceAccepts;
        if(Array.isArray(indices)){
            indiceAccepts = indices.map(indice => indice.accept(this));
        }

        const matrizFunc = new MatrizFunc(matriz, method, indiceAccepts, value);
        return matrizFunc.ejecutar(node);

    }

    /**
      * @type {BaseVisitor['visitArrayFunc']}
      */
    visitArrayFunc(node){
        const id = node.id;
        
        //buscar el arreglo en el entorno
        const arreglo = this.entornoActual.getVariable(id, node.location.start.line, node.location.start.column);

        //si no existe el arreglo
        if(!arreglo){
            //throw new Error(`El arreglo '${id}' no existe en el entorno actual\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`El arreglo '${id}' no existe en el entorno actual`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        const arrayFunc = new ArrayFunc(arreglo, node.method, node.exp);
        
        
        if(Array.isArray(node.exp) && node.exp[1] != null){
            // try{
            // node.exp[0] = node.exp[0].accept(this);
            // node.exp[1] = node.exp[1].accept(this);
            // }catch(e){
            //     console.log(e);
            //     console.log(node.exp);
            //     console.log(node.location.start.line);
            // }

            let v1 = node.exp[0].accept(this);
            let v2 = node.exp[1].accept(this);

            return arrayFunc.setElement(node, [v1, v2]);

        }

        if(Array.isArray(node.exp) && node.exp[1] == null){
            let v = node.exp[0].accept(this);
            return arrayFunc.getElement(node, v);
        }

        return arrayFunc.ejecutar(node);
        
    }



    /**
      * @type {BaseVisitor['visitReferenciaVariable']}
      */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        const valores = this.entornoActual.getVariable(nombreVariable, node.location.start.line, node.location.start.column);
        if(!valores){
            //throw new Error(`La variable '${nombreVariable}' no existe en el entorno actual\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`La variable '${nombreVariable}' no existe en el entorno actual`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }
        return valores;
    }


/**
 * @type {BaseVisitor['visitPrint']}
 */
visitPrint(node) {

    // Crear una variable temporal para almacenar los resultados antes de agregarlos a la salida
    let resultado = "";

    // Recorrer el array de expresiones
    node.exp.forEach((exp, index) => {
        const valor = exp.accept(this);

        if(valor !==null){
            if (Array.isArray(valor.valor)) {// Verificar si el valor es una matriz o array
                // función recursiva para extraer solo los valores numéricos
                const extraerValores = (arr) => {
                    return arr.map(elemento => {
                        if (Array.isArray(elemento)) {
                            // Si el elemento es un array, hacer la llamada recursiva
                            return extraerValores(elemento);
                        } else if (elemento && elemento.hasOwnProperty('valor')) {
                            // Si es un objeto con la propiedad 'valor', extraer solo el valor
                            return elemento.valor;
                        }
                        return elemento;  // En caso de no ser un objeto esperado
                    });
                };

                // Usar la función para obtener solo los valores numéricos
                const valoresExtraidos = extraerValores(valor.valor);

                // Convertir a string solo los valores extraídos
                resultado += JSON.stringify(valoresExtraidos);
            } else {
                // Para otros tipos de valores (no arrays), concatenar directamente
                resultado += valor.valor;
            }
        }else{
            resultado += valor;
        }

        // Solo agregar un espacio si no es el último valor
        if (index < node.exp.length - 1) {
            resultado += " ";
        }
    });

    // Agregar el resultado con un salto de línea al final
    this.salida += resultado + '\n';
}




    /**
      * @type {BaseVisitor['visitExpresionStmt']}
      */
    visitExpresionStmt(node) {
        node.exp.accept(this);
    }



    /**
     * @type {BaseVisitor['visitAsignacion']}
     */
    visitAsignacion(node) {
        let valor = node.asgn.accept(this);

        const asignacion = new AsigVariables(node.id, valor);
        const autorizacion = asignacion.asignar(this.entornoActual);

        if (!autorizacion){
            //throw new Error(`No se pueden asignar tipos de datos diferentes a la variable ${node.id}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`No se pueden asignar tipos de datos diferentes a la variable ${node.id}`, node.location.start.line, node.location.start.column);
            valor = {tipo: 'Error', valor: null};
            this.entornoActual.assignVariable(node.id, valor, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }
        this.entornoActual.assignVariable(node.id, valor, node.location.start.line, node.location.start.column);

        return valor;
    }



    /**
     * @type {BaseVisitor['visitBloque']}
     */
    visitBloque(node) {
        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno("bloque",entornoAnterior);

        node.dcls.forEach(dcl => {
            if (dcl) {
                dcl.accept(this);
            } else {
                console.error(`Nodo undefined encontrado en 'dcls'\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            }
        });

        this.entornoActual = entornoAnterior;
    }



    /**
     * @type {BaseVisitor['visitIf']}
     */
    visitIf(node) {

        const cond = node.cond.accept(this);
        
        //verificar que la condicion sea un booleano
        if (cond.tipo !== 'boolean') {
            //throw new Error(`Semantico; La condición del if debe ser de tipo booleano\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`La condición del if debe ser de tipo booleano`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        if (cond.valor) {
            node.stmtTrue.accept(this);
            return;
        }

        if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }

    }

    /**
     * @type {BaseVisitor['visitTernario']}
     */
    visitTernario(node){
        const cond = node.cond.accept(this);

        if(cond.valor){
            return node.expTrue.accept(this);
        }else{
            return node.expFalse.accept(this);
        }
    }


    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        const entornoAnterior = this.entornoActual;

        try{

            //verificar que la condicion sea un booleano
            if (node.cond.accept(this).tipo !== 'boolean') {
                //throw new Error(`Semantico; La condición del while debe ser de tipo booleano\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                registrarError("Semantico",`La condición del while debe ser de tipo booleano`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            while (node.cond.accept(this).valor) {
                node.stmt.accept(this);
            }
            
        }catch(e){

            this.entornoActual = entornoAnterior;
            if(e instanceof ExcepcionBrake){
                return;
            }

            if(e instanceof ExcepcionContinue){
                return this.visitWhile(node);
            }

            throw e;

        }
    }



    /**
     * @type {BaseVisitor['visitFor']}
     */
    visitFor(node) {
        
        const incrementoAntes = this.antesContinue;
        this.antesContinue = node.inc;
    
        const FOR = new nodos.Bloque({
            dcls: [
                node.init,
                new nodos.While({
                    cond: node.cond,
                    stmt: new nodos.Bloque({
                        dcls: [
                            node.stmt,
                            node.inc
                        ]
                    })
                })
            ]
        });
    
        FOR.accept(this);
        this.antesContinue = incrementoAntes;
    }


    /**
     * @type {BaseVisitor['visitForeach']}
     */
    visitForeach(node){
        const entornoAnterior = this.entornoActual;

        try{

            //obtener el arreglo que se va a recorrer
            const arreglo = node.id2.accept(this);

            //verificar que el arreglo sea un arreglo unidiemensional
            if(!Array.isArray(arreglo.valor)){
                //throw new Error(`Semantico; El objeto a recorrer debe ser un arreglo\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                registrarError("Semantico",`El objeto a recorrer debe ser un arreglo unidimensional`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            //verificar que el tipo de dato del arreglo sea el mismo que el tipo de dato de la variable
            const tipoDato = node.tipo;
            const tipoArreglo = arreglo.tipo;

            if(tipoDato !== tipoArreglo){
                //throw new Error(`Semantico; El tipo de dato del arreglo es diferente al tipo de dato de la variable\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
                registrarError("Semantico",`El tipo de dato del arreglo es diferente al tipo de dato de la variable`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }

            //implementar el foreach
            for(const valor of arreglo.valor){
                this.entornoActual = new Entorno(entornoAnterior);
                this.entornoActual.setVariable(node.id, {tipo: tipoDato, valor}, node.location.start.line, node.location.start.column); //agregar la variable al entorno
                node.stmt.accept(this);
            }

        }catch(e){
        
            this.entornoActual = entornoAnterior;
            if(e instanceof ExcepcionBrake){
                return;
            }

            if(e instanceof ExcepcionContinue){
                return this.visitForeach(node);
            }

            throw e;
        }

    }

    /**
     * @type {BaseVisitor['visitSwitch']}
     */
    visitSwitch(node){

        try{

            const switchValue = node.exp.accept(this);

            //bandera para saber si ya se ejecutado un bloque de un case
            let continueExecution = false;
    
            //iteracion solbre los casos
            for (const caseNode of node.cases){
                //evaluar la expresion del case
                const caseValue = caseNode.exp.accept(this);
    
                //si el valor del case es igual al valor del switch
                if(continueExecution || switchValue.valor === caseValue.valor){
                    
                    //ejecutar el bloque de sentencias
                    for(const stmt of caseNode.stmt){
                        stmt.accept(this);
                    }               
                    continueExecution = true;
                }
            }

            //si no se ejecuto ningun case
            if(!continueExecution && node.defaultClause){
                //ejecutar las sentencias del default
                for(const stmt of node.defaultClause.stmt){
                    stmt.accept(this);
                }
            }

        }catch(e){
                
                if(e instanceof ExcepcionBrake){
                    return;
                }
    
                if(e instanceof ExcepcionContinue){
                    return this.visitSwitch(node);
                }
    
                throw e;
        }

    }


    /**
     * @type {BaseVisitor['visitBreak']}
     */
    visitBreak(node){
        throw new ExcepcionBrake();


    }



    /**
     * @type {BaseVisitor['visitContinue']}
     */
    visitContinue(node){

        if(this.antesContinue){
            this.antesContinue.accept(this);
        }

        throw new ExcepcionContinue();
    }



    /**
     * @type {BaseVisitor['visitReturn']}
     */
    visitReturn(node){

        let valor = null

        if(node.exp){
            valor = node.exp.accept(this);
        }
        throw new ExcepcionReturn(valor);
    }



    /**
     * @type {BaseVisitor['visitLlamada']}
     */
    visitLlamada(node) {
        const nombreFuncion = node.callee.id;
        const funcion = this.entornoActual.getFuncion(nombreFuncion, node.location.start.line, node.location.start.column);
        const argumentos = node.args.map(arg => arg.accept(this));

        if(!funcion){
            registrarError("Semantico",`La función '${nombreFuncion}' no existe`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        if(funcion.tipo === 'funcion'){ //es embbebida
            if(funcion.valor.aridad != argumentos.length){
                registrarError("Semantico",`Número incorrecto de argumentos para la función '${nombreFuncion}'`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }
            const resultado = funcion.valor.invocar(argumentos);
            return resultado;
        }else{
            if (funcion.valor.aridad() !== argumentos.length) {
                registrarError("Semantico",`Número incorrecto de argumentos para la función '${nombreFuncion}'`, node.location.start.line, node.location.start.column);
                return {tipo: 'Error', valor: null};
            }
        }
    
        const resultado = funcion.valor.invocar(this, argumentos, nombreFuncion);
        return resultado;
    }


    /**
     * @type {BaseVisitor['visitFuncDcl']}
     */
    visitFuncDcl(node) {
        const funcion = new FuncionForanea(node, this.entornoActual);

        if(funcion.verificarReservada(node, node.id)){
            registrarError('Semántico', `El ID de la fucion ${node.id} es una palabra reservada`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        };

        this.entornoActual.setFuncion(node.id, {tipo: node.tipo, valor: funcion}, node.location.start.line, node.location.start.column);
    }


    /**
     * @type {BaseVisitor['visittypEof']}
     */
    visittypEof(node){
        const argumento = node.exp.accept(this);
        if(argumento.tipo === 'Error' || argumento === null){
            registrarError("Semantico", `No se puede determinar el tipo de '${node.exp}'`, node.location.start.line, node.location.start.column);
            return { tipo: 'Error', valor: null };
        }

        if(argumento instanceof Instancia){
            return {tipo: 'string', valor: argumento.clase.nombre};
        }

        if(argumento.tipo != 'int' && argumento.tipo != 'float' && argumento.tipo != 'string' && argumento.tipo != 'boolean' && argumento.tipo != 'char' && argumento.tipo != 'struct' && (!(argumento instanceof Instancia ))){
            return {tipo: 'string', valor: argumento.tipo};
        }

        // Devolver el tipo como string
        switch (argumento.tipo) {
            case 'int':
                return { tipo: 'string', valor: 'int' };
            case 'float':
                return { tipo: 'string', valor: 'float' };
            case 'string':
                return { tipo: 'string', valor: 'string' };
            case 'boolean':
                return { tipo: 'string', valor: 'boolean' };
            case 'char':
                return { tipo: 'string', valor: 'char' };
            case 'struct':
                return { tipo: 'string', valor: 'struct' };
            default:
                registrarError("Semantico", `Tipo de dato no soportado para typeof`, node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };
        }
    }



    /**
     * @type {BaseVisitor['visitStructDcl']}
     */
    visitStructDcl(node){
        const metodos = {};
        const propiedades = {};

        node.dcls.forEach(dcl => {
            if(dcl instanceof nodos.FuncDcl){
                metodos[dcl.id] = new FuncionForanea(dcl, this.entornoActual);
            }else if(dcl instanceof nodos.DeclaracionTipoVariable){
                propiedades[dcl.id] = dcl.exp;
            }
        });

        //verificar si es el entorno global, si es el entorno global se puede declarar el struct si no, no se puede declarar
        if(this.entornoActual.obtenerNombreEntorno() !== 'Global'){
            registrarError("Semantico", `No se puede declarar un struct en un bloque diferente al entorno global`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        const struct = new Struct(node.id, propiedades, metodos);

        if(struct.verificarReservada(node, node.id)){
            registrarError("Semantico", `El ID '${node.id}' del struct es una palabra reservada`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        this.entornoActual.setVariable(node.id, {tipo: 'struct', valor: struct}, node.location.start.line, node.location.start.column);

    }


    /**
     * @type {BaseVisitor['visitInstancia']}
     */
    visitInstancia(node){

        const struct = this.entornoActual.getVariable(node.id, node.location.start.line, node.location.start.column);

        //const argumentos = node.args.map(arg => arg.accept(this));

        //los node.args vienene así: (3) [{…}, {…}, {…}] donde es 0: {id: 'nombre', exp: Cadena} 1: {id: 'edad', exp: Numero} 2: {id: 'estatura', exp: Numero} por ejemplo
        // Procesa los argumentos como { id, exp } y acepta el valor de 'exp'
        const argumentos = node.args.map(arg => {
            const valor = arg.exp.accept(this);  // Acepta la expresión
            return { id: arg.id, valor };  // Retorna un objeto con el id y el valor evaluado
        });
        

        if(!(struct.valor instanceof Struct)){
            registrarError("Semantico", `El ID '${node.id}' no es un struct`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }

        return struct.valor.invocar(this, argumentos, node);
    
    }

    

    /**
    * @type {BaseVisitor['visitGet']}
    */
    visitGet(node) {
        const instancia = node.objetivo.accept(this);

        if(instancia.valor === undefined){
            if(!(instancia instanceof Instancia)){
                registrarError('Semántico', 'No es posible obtener una propiedad de algo que no es una instancia', node.location.start.line, node.location.start.column);
                return { tipo: 'Error', valor: null };
            }
            return instancia.get(node.propiedad, node);
        }

        if (!(instancia.valor instanceof Instancia)) {
            registrarError('Semántico', 'No es posible obtener una propiedad de algo que no es una instancia', node.location.start.line, node.location.start.column);
            return { tipo: 'Error', valor: null };
        }
        return instancia.valor.get(node.propiedad, node);
    }


    
    /**
    * @type {BaseVisitor['visitSet']}
    */
    visitSet(node) {

        const instancia = node.objetivo.accept(this);

        if (!(instancia.valor instanceof Instancia)) {
            //throw new Error('No es posible asignar una propiedad de algo que no es una instancia');
            registrarError('Semántico', 'No es posible asignar una propiedad de algo que no es una instancia', node.location.start.line, node.location.start.column);
            return { tipo: 'Error', valor: null };
        }

        const valor = node.valor.accept(this);

        instancia.valor.set(node.propiedad, valor);

        return valor;
    }



    /**
    * @type {BaseVisitor['visitObjKey']}
    */  
    visitObjKey(node){
        
        const instancia = node.exp.accept(this);

        if (!(instancia.valor instanceof Instancia)) {
            registrarError('Semántico', 'No es posible obtener las propiedades de algo que no es una instancia', node.location.start.line, node.location.start.column);
            return { tipo: 'Error', valor: null };
        }

        //obtener las propiedades del struct y retornarlas como un arreglo
        const propiedades = instancia.valor.propiedades;
        const keys = Object.keys(propiedades);
        return {tipo: 'string', valor: keys};

    }


}