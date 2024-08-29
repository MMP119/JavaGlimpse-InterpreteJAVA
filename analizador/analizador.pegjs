
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
        "break": nodos.Break,
        "continue": nodos.Continue,
        "return": nodos.Return,
        "llamada": nodos.Llamada,
        "ternario": nodos.Ternario,
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
    }

}


programa = _ dcl:Declaracion* _ { return dcl }


Declaracion = dcl:DecVariable _ { return dcl }

            / stmt:Stmt _ { return stmt }


DecVariable = tipo:TiposDatosPrimitivos _ id:Identificador _  "=" _ exp:Expresion _ ";" { return crearNodo('declaracionTipoVariable', { tipo, id, exp }) }

            / tipo:TiposDatosPrimitivos _ id:Identificador _ ";" { const exp = null; return crearNodo('declaracionTipoVariable', { tipo, id, exp }) }


// steatements NO DECLARATIVOS, es decir, que no declaran variables
Stmt = "System.out.println(" _ exp:Expresion _ ")" _ ";" { return crearNodo('print', { exp }) }

    / "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }

    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt stmtFalse:( _ "else" _ stmtFalse:Stmt { return stmtFalse } )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }

    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }

    / "for" _ "(" _ init: ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt: Stmt {return crearNodo('for', { init, cond, inc, stmt })}
    
    / "break" _ ";" { return crearNodo('break') }

    / "continue" _ ";" { return crearNodo('continue') }

    / "return" _ exp:Expresion? _ ";" { return crearNodo('return', { exp }) }

    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }


ForInit = dcl:Declaracion { return dcl }

        / exp:Expresion _ ";"{ return exp }

        / ";" { return null }


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


Ternario = cond:Comparacion _ "?" _ expTrue:Expresion _ ":" _ expFalse:Expresion { return crearNodo('ternario', { cond, expTrue, expFalse }) }


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

    / id:Identificador { return crearNodo('referenciaVariable', { id }) }



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