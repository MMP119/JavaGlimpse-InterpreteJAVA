import {Entorno} from './entorno.js'
import {BaseVisitor} from './visitor.js'
import nodos, {Expresion} from './nodos.js';
import {ExcepcionBrake, ExcepcionContinue, ExcepcionReturn} from '../expresiones/transferencia.js';
import {Invocable} from '../expresiones/invocable.js';
import {embebidas} from '../expresiones/embebidas.js';
import {Aritmetica} from '../expresiones/aritmeticas.js';
import {DecVariables} from '../expresiones/decVariables.js';
import {Relacionales} from '../expresiones/relacionales.js';
import {Logicas} from '../expresiones/logicas.js';
import {Unaria} from '../expresiones/Unaria.js';
import {AsigVariables} from '../expresiones/asigVariables.js';

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

        const {tipo, valor} = declararVariable.asignar(node);

        this.entornoActual.setVariable(nombreVariable, {tipo, valor});

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

        if(valor.tipo === null && valor.valor === null){ //significa que es una division por 0
            this.salida += `\n¡ADVERTENCIA! No se puede dividir entre 0 \nLínea: ${node.location.start.line}, columna: ${node.location.start.column}\n`;
            }


        this.salida += valor.valor + '\n';
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

        if (cond.valor) {
            node.stmtTrue.accept(this);
            return;
        }

        if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }

    }



    /**
     * @type {BaseVisitor['visitWhile']}
     */
    visitWhile(node) {
        const entornoAnterior = this.entornoActual;

        try{

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