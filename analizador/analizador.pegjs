
{
    const crearNodo = (tipoNodo, props) =>{
    const tipos = {
        'numero': nodos.Numero,
        'agrupacion': nodos.Agrupacion,
        'binaria': nodos.OperacionBinaria,
        'unaria': nodos.OperacionUnaria,
        'declaracionTipoVariable': nodos.DeclaracionTipoVariable,
        'referenciaVariable': nodos.ReferenciaVariable,
        'print': nodos.Print,
        'expresionStmt': nodos.ExpresionStmt,
        'asignacion': nodos.Asignacion,
        'bloque': nodos.Bloque,
        'if': nodos.If,
        'while': nodos.While,
        'cadena': nodos.Cadena,
        'booleano': nodos.Booleano,
        "for": nodos.For,
        "foreach": nodos.Foreach,
        "break": nodos.Break,
        "continue": nodos.Continue,
        "return": nodos.Return,
        "llamada": nodos.Llamada,
        "ternario": nodos.Ternario,
        "switch": nodos.Switch,
        "declaracionArreglo": nodos.DeclaracionArreglo,
        "arrayFunc": nodos.ArrayFunc,
        "declaracionMatriz": nodos.DeclaracionMatriz,
        "matrizFunc": nodos.MatrizFunc,
        'dclFunc': nodos.FuncDcl,
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
    }

}


programa = _ dcl:Declaracion* _ { return dcl }


Declaracion = dcl:DecVariable _ { return dcl }
            / dcl:DecFuncion _ { return dcl }
            / stmt:Stmt _ { return stmt }


//para funciones
DecFuncion = tipo:(TiposDatosPrimitivos /"void")  _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('dclFunc', { tipo, id, params: params || [], bloque }) }

Parametros = primerParam:Parametro _ params:("," _ param:Parametro { return param })* { return [primerParam, ...params] }

Parametro = tipo:( tip:TiposDatosPrimitivos ConArreglo {return tip;} / TiposDatosPrimitivos) _ id:Identificador { return { tipo, id } }

ConArreglo = _ ("[" _ "]")+



DecVariable = tipo:TiposDatosPrimitivos _ id:Identificador _  "=" _ exp:Expresion _ ";" { return crearNodo('declaracionTipoVariable', { tipo, id, exp }) }

            / tipo:TiposDatosPrimitivos _ id:Identificador _ ";" { const exp = null; return crearNodo('declaracionTipoVariable', { tipo, id, exp }) }

            //declaracion de arrays con inicializacion de valores
            /tipo:TiposDatosPrimitivos _ "[" _ "]" _ id:Identificador _ "=" _ "{" _ exp:ExpresionConComa _ "}" _ ";" {const tipo2 = null; const id2 = null; return crearNodo('declaracionArreglo',{tipo, id, exp, tipo2, id2})}

            //declaracion de arrays reservando un espacio especifico
            /tipo:TiposDatosPrimitivos _ "[" _ "]" _ id:Identificador _ "=" _ "new" _  tipo2:TiposDatosPrimitivos _ "[" _ exp:Expresion _ "]" _ ";" {const id2=null; return crearNodo('declaracionArreglo',{tipo, id, exp, tipo2, id2})}

            //declaracion cuadno es una copia de otro array
            /tipo:TiposDatosPrimitivos _ "[" _ "]" _ id:Identificador _ "=" _ id2:Expresion _ ";" {const exp = null; const tipo2 = null;return crearNodo('declaracionArreglo',{tipo, id, exp, tipo2, id2})}


            //declaracion e inicializacion de una matriz directamente por ejemplo int [][][] matriz = {{1,2,3},{4,5,6},{7,8,9}};            
            /tipo:TiposDatosPrimitivos _ "[" _ "]" _ ("[" _ "]")+ _ id:Identificador _ "=" _ exp:MatrizValores _ ";" {

                const tipo2 = null; const expN = null; return crearNodo('declaracionMatriz', {tipo, id, exp, expN, tipo2})

            }

            //declaracion de matrices reservando un espacio especifico
            /tipo:TiposDatosPrimitivos _ "[" _ "]" _ ("[" _ "]")+ _ id:Identificador _ "=" _ "new" _ tipo2:TiposDatosPrimitivos _ "[" _ exp:Expresion _ "]" _ expN:("[" _ expN1:Expresion _ "]" {return expN1})+ _ ";" 
                {

                    return crearNodo('declaracionMatriz', {tipo, id, exp, expN, tipo2})

                }


MatrizValores = _ "{" _ elementos:ElementosAnidados _ "}" {return elementos}

ElementosAnidados = primer:MatrizElemento _ siguiente:("," _ siguienteElem:MatrizElemento {return siguienteElem})* {return [primer,...siguiente];}

MatrizElemento = "{" _ valores:ElementosAnidados _ "}" {return valores}
        / valor: Expresion {return valor}

ExpresionConComa = exp:Expresion _ coma:("," _ exp2:Expresion{return exp2})* { return [exp, ...coma] } //para las expresiones con coma



// steatements NO DECLARATIVOS, es decir, que no declaran variables
Stmt = "System.out.println(" _ exp:ExpresionConComa _ ")" _ ";" { return crearNodo('print', { exp }) }

    / Bloque:Bloque { return Bloque }

    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt stmtFalse:( _ "else" _ stmtFalse:Stmt { return stmtFalse } )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }

    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }

    / "for" _ "(" _ init: ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt: Stmt {return crearNodo('for', { init, cond, inc, stmt })}

    // foreach, solo recorre areglo uni-dimensional
    / "for" _ "(" _  tipo:TiposDatosPrimitivos _ id:Identificador _ ":" _ id2:Expresion _ ")" _ stmt: Stmt {return crearNodo('foreach', { tipo, id, id2, stmt })}
    
    / "break" _ ";" { return crearNodo('break') }

    / "continue" _ ";" { return crearNodo('continue') }

    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }

    / SwitchStmt //reglas para el switch-case

    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }


Bloque = "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }


ForInit = dcl:Declaracion { return dcl }

        / exp:Expresion _ ";"{ return exp }

        / ";" { return null }


SwitchStmt = "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ cases: CaseClause* _ defaultClause: DefaultClause? _ "}"{return crearNodo('switch', { exp, cases, defaultClause: defaultClause || null });}


CaseClause = _ "case" _ exp:Expresion _ ":" _ stmt:( _ st:Stmt _ { return st })*{return { exp, stmt: stmt || [] };}


DefaultClause = "default" _ ":" _ stmt:(_ st:Stmt _{return st})*{return { stmt };}


Expresion = Asignacion


Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('asignacion', { id, asgn }) }

            / OperadorAsignacion

            / Ternario
            
            / Or


OperadorAsignacion = id: Identificador _ expansion:( _ op:("+=" / "-=") _  der:Relacionales { return { tipo: op, der } }) 
{
    const { tipo, der } = expansion;
    // Identificamos el operador aritmético basado en el operador de asignación compuesta
    const operadorAritmetico = tipo === "+=" ? "+" : "-";
    // Creamos la expresión expandida a = a + der
    const expresionAritmetica = crearNodo('binaria', { op: operadorAritmetico, izq: crearNodo('referenciaVariable', { id }), der });
    return crearNodo('asignacion', { id, asgn: expresionAritmetica });
}


Ternario = cond:Comparacion _ "?" _ expTrue:Expresion _ ":" _ expFalse:Expresion { return crearNodo('ternario', { cond, expTrue, expFalse }) }


Or = izq:And expansion:(_ "||" _ der:And { return der })* 
{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        return crearNodo('binaria', { op:'||', izq: operacionAnterior, der: operacionActual })
    },
    izq
    )
}


And = izq:Comparacion expansion:(_ "&&" _ der:Comparacion { return der })* 
{ 
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
            return crearNodo('binaria', { op:'&&', izq: operacionAnterior, der: operacionActual })
    },
    izq
    )
}


Comparacion = izq:Relacionales expansion:(_ op:("==" / "!=") _ der:Relacionales { return { tipo: op, der } })* 
{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Relacionales = izq:Suma expansion:(_ op:("<="/ "<" / ">=" / ">") _ der:Suma { return { tipo: op, der } })* 
{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Suma = izq:Multiplicacion expansion:( _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } })* 

{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Multiplicacion = izq:Unaria expansion:(_ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } })* 
{
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
        },
        izq
    )
}


Unaria = "-" _ num:Unaria { return crearNodo('unaria', { op: '-', exp: num }) }

    / "!" _ num:Unaria { return crearNodo('unaria', { op: '!', exp: num }) }
    
    / LlamadaFuncion


LlamadaFuncion = callee:Datos _ params:("(" args: Argumentos? ")"{return args})*{
    return params.reduce(
        (callee, args) => {
        return crearNodo('llamada', { callee, args: args || [] })
        },
        callee
    )
}

Argumentos = arg: Expresion _ args:("," _ exp: Expresion {return exp})* {return [arg, ...args]} //para los argumentos de las funciones


Datos =  "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }

    / "[" _ exp:Expresion _ "]" { return crearNodo('agrupacion', { exp }) }

    /NumeroDecimal

    / NumeroEntero

    / Cadena

    / Booleano

    / ArrayFunc

    / id:Identificador { return crearNodo('referenciaVariable', { id }) }


ArrayFunc = id:Identificador _ "." _ method:("indexOf"/"join"/"length") _ exp:("(" _  exp:Expresion? _ ")" {return exp})? {return crearNodo('arrayFunc', { id, method, exp })} 
    
    / id:Identificador _ "[" _ index:Expresion _ "]" _ "=" _ value:Expresion      {return crearNodo('arrayFunc', { id, method:'setElement', exp:[index, value]});} 
    
    / id:Identificador _ "[" _ index: Expresion "]" _  indices:("[" _ index1: Expresion _ "]"{return index1})+ _ "=" _ value:Expresion {return crearNodo('matrizFunc', { id, method:'setElement', indexs:[index, ...indices], value});} 
    
    / id:Identificador _ "[" _ index: Expresion "]" _  indices:("[" _ index1: Expresion _ "]"{return index1})+ {const value = null; return crearNodo('matrizFunc', { id, method:'getElement', indexs:[index, ...indices], value});}

    / id:Identificador _ "[" _ index:Expresion _ "]"                          {const value = null; return crearNodo('arrayFunc', { id, method:'getElement', exp:[index,value]});} 

    //ahora asignacion de valores a las matrices



NumeroEntero = [0-9]+//( "." [0-9]+ )? 
    {
    const valorNum = parseInt(text(),10);
    return crearNodo('numero', { tipo:'int',valor: valorNum});
    } 


NumeroDecimal = [0-9]+("." [0-9]+)
    {
    const valorNum = parseFloat(text(),10);
    return crearNodo('numero', { tipo:'float',valor:valorNum});
    } 


// nueva regla para cadenas de texcto con secuencias de escape
Cadena = "\"" chars: Caracteres* "\"" {return crearNodo('cadena', {tipo: 'string', valor: chars.join('')})} //el char.join es para unir los caracteres de la cadena
    
        / Caracter //para cadenas de un solo caracter


Caracter = "\'" chars: Caracteres "\'" {return crearNodo('cadena', {tipo: 'char', valor: chars})}


Caracteres = EscapeSequence 
    / [^\\"] // cualquier caracter que no sea una barra invertida o comillas dobles


EscapeSequence = "\\" esc:(["\\nrt"]) { 
    switch (esc) {
        case 'n': return '\n';
        case 't': return '\t';
        case 'r': return '\r';
        case '\\': return '\\';
        case '"': return '"';
    }
}


TiposDatosPrimitivos = "int" / "float" / "string" / "boolean" / "char" / "var"  { return text() }


// Ignorar espacios en blanco y comentarios, tanto de una línea como multilínea
_ = ([ \t\n\r] / Comentarios)*


//Espresiones regulares para comentarios
Comentarios = "//" (![\n] .)* 
            / "/*"(!( "*/") .)* "*/"

// expresion para identificadores
Identificador = [a-zA-Z_][a-zA-Z0-9_]* { const id = text(); return id;}//if(!isValidIdentificador(id)) { throw new Error(`Identificador inválido: ${id}, es una palabra reservada del lenguaje`); return null;} return id; }

//expresion para los booleanos
Booleano = "true" { return crearNodo('booleano', {tipo: 'boolean', valor: true})}
        / "false" { return crearNodo('booleano', {tipo: 'boolean', valor: false})}