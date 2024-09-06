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

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno(); //este es el entorno global, se inicia el visitor
        this.salida = '';

        // funciones embebidas
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.entornoActual.setFuncion(nombre, funcion, "", "");
            //console.log(`Función embebida: ${nombre}`, funcion);  // Imprime para verificar que las funciones están siendo añadidas correctamente
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
        if(declararVariable.verificarReservada(node, nombreVariable)) return;

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

        if(declararArreglo.verificarReservada(node, idArreglo1, idArreglo2)) return;

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
            if(declararMatriz.verificarReservada(node, idMatriz)) return;

            const {tipo, valor} = declararMatriz.declararMatriz(node);

            this.entornoActual.setVariable(idMatriz, {tipo, valor}, node.location.start.line, node.location.start.column);


        }else{

            let expAccept;
            
            // Función recursiva para aceptar arreglos de cualquier dimensión
            const aceptarArreglo = (arr) => {
                if (Array.isArray(arr)) {
                    // Si es un arreglo, aplicar recursivamente la misma función para cada elemento
                    return arr.map(subElemento => aceptarArreglo(subElemento));
                } else {
                    // Si es un elemento base (no un arreglo), aceptar el valor
                    return arr.accept(this);
                }
            }

            // Verificar si node.exp es un arreglo de múltiples dimensiones y procesarlo recursivamente
            if (Array.isArray(node.exp)) {
                expAccept = aceptarArreglo(node.exp);
            }

            const declararMatriz = new DecMatriz(node.tipo, idMatriz, expAccept, node.expN, node.tipo2);
            if(declararMatriz.verificarReservada(node, idMatriz)) return;

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

        // Si el valor es null, manejar el caso de división por 0
        if (valor.tipo === null && valor.valor === null) {
            this.salida += `\n¡ADVERTENCIA! No se puede dividir entre 0 \nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`;
        } else {
            // Verificar si el valor es una matriz o array
            if (Array.isArray(valor.valor)) {
                // Crear una función recursiva para extraer solo los valores numéricos
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
        const valor = node.asgn.accept(this);

        const asignacion = new AsigVariables(node.id, valor);
        const autorizacion = asignacion.asignar(this.entornoActual);

        if (!autorizacion){
            //throw new Error(`No se pueden asignar tipos de datos diferentes a la variable ${node.id}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`No se pueden asignar tipos de datos diferentes a la variable ${node.id}`, node.location.start.line, node.location.start.column);
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
        this.entornoActual = new Entorno(entornoAnterior);

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
        const funcion = this.entornoActual.getVariable(nombreFuncion, node.location.start.line, node.location.start.column);
        const argumentos = node.args.map(arg => arg.accept(this));
    
        if (!(funcion.valor instanceof Invocable)) {
            //throw new Error(`La variable '${nombreFuncion}' no es invocable\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`La funcion '${nombreFuncion}' no es invocable`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }
    
        if (funcion.valor.aridad() !== argumentos.length) {
            //throw new Error(`Número incorrecto de argumentos para la función '${nombreFuncion}'\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
            registrarError("Semantico",`Número incorrecto de argumentos para la función '${nombreFuncion}'`, node.location.start.line, node.location.start.column);
            return {tipo: 'Error', valor: null};
        }
    
        const resultado = funcion.valor.invocar(this, argumentos);
        return resultado;
    }


    /**
     * @type {BaseVisitor['visitFuncDcl']}
     */
    visitFuncDcl(node) {
        const funcion = new FuncionForanea(node, this.entornoActual);

        if(funcion.verificarReservada(node, node.id))return;

        this.entornoActual.setVariable(node.id, {tipo: node.tipo, valor: funcion}, node.location.start.line, node.location.start.column);
    }

}