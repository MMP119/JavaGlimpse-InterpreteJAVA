import {Entorno} from './entorno.js'
import {BaseVisitor} from './visitor.js'
import nodos, {Expresion} from './nodos.js';
import {ExcepcionBrake, ExcepcionContinue, ExcepcionReturn} from '../expresiones/transferencia.js';
import {Invocable} from '../expresiones/invocable.js';
import {embebidas} from '../expresiones/embebidas.js';
import {Aritmetica} from '../expresiones/aritmeticas.js';
import {DecVariables} from '../expresiones/decVariables.js';
import {DecArreglos} from '../expresiones/decArreglos.js';
import {Relacionales} from '../expresiones/relacionales.js';
import {Logicas} from '../expresiones/logicas.js';
import {Unaria} from '../expresiones/Unaria.js';
import {AsigVariables} from '../expresiones/asigVariables.js';
import {ArrayFunc} from '../expresiones/arrayFunc.js';

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno(); //este es el entorno global, se inicia el visitor
        this.salida = '';

        // funciones embebidas
        Object.entries(embebidas).forEach(([nombre, funcion]) => {
            this.entornoActual.setFuncion(nombre, funcion);
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
            throw new Error(`Operador no soportado: ${node.op}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
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
        declararVariable.verificarReservada(node, nombreVariable);

        const {tipo, valor} = declararVariable.asignar(node);

        this.entornoActual.setVariable(nombreVariable, {tipo, valor});

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
            expresion = node.exp;
        }else{
            expresion = node.exp.accept(this);
        }

        const tipoArreglo2 = node.tipo2;
        const idArreglo2 = node.id2 ? node.id2.accept(this): node.id2;

        const declararArreglo = new DecArreglos(tipoArreglo1, idArreglo1, expresion, tipoArreglo2, idArreglo2);

        declararArreglo.verificarReservada(node, idArreglo1, idArreglo2);

        const {tipo, valor} = declararArreglo.declarar(node);
        //console.log(valor[3]); //prueba de impresion de un valor de un arreglo en una posicion especifica
        
        this.entornoActual.setVariable(idArreglo1, {tipo, valor});

    }

    /**
      * @type {BaseVisitor['visitArrayFunc']}
      */
    visitArrayFunc(node){
        const id = node.id;
        
        //buscar el arreglo en el entorno
        const arreglo = this.entornoActual.getVariable(id);

        //si no existe el arreglo
        if(!arreglo){
            throw new Error(`El arreglo '${id}' no existe en el entorno actual\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
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
        const valores = this.entornoActual.getVariable(nombreVariable);
        return valores;
    }


    /**
      * @type {BaseVisitor['visitPrint']}
      */
    visitPrint(node) {
        const valor = node.exp.accept(this);
    
        if (valor.tipo === null && valor.valor === null) {
            this.salida += `\n¡ADVERTENCIA! No se puede dividir entre 0 \nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`;
        }
    
        // Usamos JSON.stringify para imprimir los arrays con corchetes
        this.salida += Array.isArray(valor.valor) ? JSON.stringify(valor.valor) + '\n' : valor.valor + '\n';
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
            throw new Error(`No se pueden asignar tipos de datos diferentes a la variable ${node.id}\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
        this.entornoActual.assignVariable(node.id, valor);

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
            throw new Error(`Semantico; La condición del if debe ser de tipo booleano\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
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
                throw new Error(`Semantico; La condición del while debe ser de tipo booleano\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
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
        const funcion = this.entornoActual.getFuncion(nombreFuncion);
        const argumentos = node.args.map(arg => arg.accept(this));
    
        if (!(funcion instanceof Invocable)) {
            throw new Error(`La variable '${nombreFuncion}' no es invocable\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
    
        if (funcion.aridad() !== argumentos.length) {
            throw new Error(`Número incorrecto de argumentos para la función '${nombreFuncion}'\nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`);
        }
    
        const resultado = funcion.invocar(this, argumentos);
        return resultado;
    }

}