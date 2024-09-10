
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Agrupacion extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAgrupacion(this);
    }
}
    
export class Numero extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato
 * @param {entero} options.valor Valor del numero
    */
    constructor({ tipo, valor }) {
        super();
        
        /**
         * Tipo de dato
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Valor del numero
         * @type {entero}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitNumero(this);
    }
}
    
export class Cadena extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato
 * @param {String} options.valor Valor de la cadena
    */
    constructor({ tipo, valor }) {
        super();
        
        /**
         * Tipo de dato
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Valor de la cadena
         * @type {String}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCadena(this);
    }
}
    
export class Booleano extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato
 * @param {Boolean} options.valor Valor del booleano
    */
    constructor({ tipo, valor }) {
        super();
        
        /**
         * Tipo de dato
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Valor del booleano
         * @type {Boolean}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBooleano(this);
    }
}
    
export class DeclaracionTipoVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionTipoVariable(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a imprimir
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a imprimir
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class ExpresionStmt extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStmt(this);
    }
}
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.asgn Expresion a asignar
    */
    constructor({ id, asgn }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.asgn = asgn;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Sentencias del bloque
    */
    constructor({ dcls }) {
        super();
        
        /**
         * Sentencias del bloque
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del if
 * @param {Expresion} options.stmtTrue Cuerpo del if
 * @param {Expresion|undefined} options.stmtFalse Cuerpo del else
    */
    constructor({ cond, stmtTrue, stmtFalse }) {
        super();
        
        /**
         * Condicion del if
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del if
         * @type {Expresion}
        */
        this.stmtTrue = stmtTrue;


        /**
         * Cuerpo del else
         * @type {Expresion|undefined}
        */
        this.stmtFalse = stmtFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del while
 * @param {Expresion} options.stmt Cuerpo del while
    */
    constructor({ cond, stmt }) {
        super();
        
        /**
         * Condicion del while
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del while
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.init Inicializacion del for
 * @param {Expresion} options.cond Condicion del for
 * @param {Expresion} options.inc Incremento del for
 * @param {Expresion} options.stmt Cuerpo del for
    */
    constructor({ init, cond, inc, stmt }) {
        super();
        
        /**
         * Inicializacion del for
         * @type {Expresion}
        */
        this.init = init;


        /**
         * Condicion del for
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Incremento del for
         * @type {Expresion}
        */
        this.inc = inc;


        /**
         * Cuerpo del for
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}
    
export class Foreach extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato
 * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.id2 Identificador del arreglo
 * @param {Expresion} options.stmt Cuerpo del foreach
    */
    constructor({ tipo, id, id2, stmt }) {
        super();
        
        /**
         * Tipo de dato
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Identificador del arreglo
         * @type {Expresion}
        */
        this.id2 = id2;


        /**
         * Cuerpo del foreach
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitForeach(this);
    }
}
    
export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}
    
export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}
    
export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion | undefined} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a retornar
         * @type {Expresion | undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
    
export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Expresion a llamar
 * @param {Expresion[]} options.args Argumentos de la llamada
    */
    constructor({ callee, args }) {
        super();
        
        /**
         * Expresion a llamar
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos de la llamada
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}
    
export class FuncDcl extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de dato
 * @param {string} options.id Identificador de la funcion
 * @param {string[]} options.params Parametros de la funcion
 * @param {Bloque} options.bloque Cuerpo de la funcion
    */
    constructor({ tipo, id, params, bloque }) {
        super();
        
        /**
         * Tipo de dato
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {string[]}
        */
        this.params = params;


        /**
         * Cuerpo de la funcion
         * @type {Bloque}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncDcl(this);
    }
}
    
export class Ternario extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del ternario
 * @param {Expresion} options.expTrue Expresion si la condicion es verdadera
 * @param {Expresion} options.expFalse Expresion si la condicion es falsa
    */
    constructor({ cond, expTrue, expFalse }) {
        super();
        
        /**
         * Condicion del ternario
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Expresion si la condicion es verdadera
         * @type {Expresion}
        */
        this.expTrue = expTrue;


        /**
         * Expresion si la condicion es falsa
         * @type {Expresion}
        */
        this.expFalse = expFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitTernario(this);
    }
}
    
export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
 * @param {Expresion []} options.cases Casos del switch
 * @param {Expresion [] | undefined | null} options.defaultClause default del switch
    */
    constructor({ exp, cases, defaultClause }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Casos del switch
         * @type {Expresion []}
        */
        this.cases = cases;


        /**
         * default del switch
         * @type {Expresion [] | undefined | null}
        */
        this.defaultClause = defaultClause;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}
    
export class DeclaracionArreglo extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo del arreglo
 * @param {string} options.id Identificador del arreglo
 * @param {Expresion} options.exp Expresion del arreglo
 * @param {string} options.tipo2 Tipo del arreglo 2
 * @param {Expresion} options.id2 Identificador del arreglo 2
    */
    constructor({ tipo, id, exp, tipo2, id2 }) {
        super();
        
        /**
         * Tipo del arreglo
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion del arreglo
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Tipo del arreglo 2
         * @type {string}
        */
        this.tipo2 = tipo2;


        /**
         * Identificador del arreglo 2
         * @type {Expresion}
        */
        this.id2 = id2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionArreglo(this);
    }
}
    
export class DeclaracionMatriz extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la matriz
 * @param {string} options.id Identificador de la matriz
 * @param {Expresion} options.exp Expresion de la matriz1
 * @param {Expresion} options.expN Expresion de la matrizN, arreglo de arreglos
 * @param {string} options.tipo2 Tipo de la matriz2
    */
    constructor({ tipo, id, exp, expN, tipo2 }) {
        super();
        
        /**
         * Tipo de la matriz
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la matriz
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la matriz1
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Expresion de la matrizN, arreglo de arreglos
         * @type {Expresion}
        */
        this.expN = expN;


        /**
         * Tipo de la matriz2
         * @type {string}
        */
        this.tipo2 = tipo2;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionMatriz(this);
    }
}
    
export class ArrayFunc extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.id Identificador del arreglo
 * @param {string} options.method método que se va a ejecutar
 * @param {Expresion} options.exp expresion, indice o valor
    */
    constructor({ id, method, exp }) {
        super();
        
        /**
         * Identificador del arreglo
         * @type {Expresion}
        */
        this.id = id;


        /**
         * método que se va a ejecutar
         * @type {string}
        */
        this.method = method;


        /**
         * expresion, indice o valor
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitArrayFunc(this);
    }
}
    
export class MatrizFunc extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.id Identificador de la matriz
 * @param {string} options.method método que se va a ejecutar
 * @param {Expresion} options.indexs expresion, indice o valor
 * @param {Expresion} options.value expresion que se va a asignar
    */
    constructor({ id, method, indexs, value }) {
        super();
        
        /**
         * Identificador de la matriz
         * @type {Expresion}
        */
        this.id = id;


        /**
         * método que se va a ejecutar
         * @type {string}
        */
        this.method = method;


        /**
         * expresion, indice o valor
         * @type {Expresion}
        */
        this.indexs = indexs;


        /**
         * expresion que se va a asignar
         * @type {Expresion}
        */
        this.value = value;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitMatrizFunc(this);
    }
}
    
export class typEof extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visittypEof(this);
    }
}
    
export class StructDcl extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del struct
 * @param {Expresion[]} options.dcls Declaraciones del struct
    */
    constructor({ id, dcls }) {
        super();
        
        /**
         * Identificador del struct
         * @type {string}
        */
        this.id = id;


        /**
         * Declaraciones del struct
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitStructDcl(this);
    }
}
    
export class Instancia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la instancia del struct
 * @param {string} options.id identificador de la instancia
 * @param {Expresion[]} options.args Argumentos de la instancia
    */
    constructor({ tipo, id, args }) {
        super();
        
        /**
         * Tipo de la instancia del struct
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * identificador de la instancia
         * @type {string}
        */
        this.id = id;


        /**
         * Argumentos de la instancia
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstancia(this);
    }
}
    
export class Get extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
    */
    constructor({ objetivo, propiedad }) {
        super();
        
        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitGet(this);
    }
}
    
export class Set extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
 * @param {Expresion} options.valor Valor de la propiedad
    */
    constructor({ objetivo, propiedad, valor }) {
        super();
        
        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;


        /**
         * Valor de la propiedad
         * @type {Expresion}
        */
        this.valor = valor;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSet(this);
    }
}
    
export default { Expresion, OperacionBinaria, OperacionUnaria, Agrupacion, Numero, Cadena, Booleano, DeclaracionTipoVariable, ReferenciaVariable, Print, ExpresionStmt, Asignacion, Bloque, If, While, For, Foreach, Break, Continue, Return, Llamada, FuncDcl, Ternario, Switch, DeclaracionArreglo, DeclaracionMatriz, ArrayFunc, MatrizFunc, typEof, StructDcl, Instancia, Get, Set }
