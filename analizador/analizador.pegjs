
{
    const crearNodo = (tipoNodo, props) =>{
    const tipos = {
        'numero': nodos.Numero,
        'agrupacion': nodos.Agrupacion,
        'binaria': nodos.OperacionBinaria,
        'unaria': nodos.OperacionUnaria,
        'declaracionVariable': nodos.DeclaracionVariable,
        'referenciaVariable': nodos.ReferenciaVariable,
        'print': nodos.Print,
        'expresionStmt': nodos.ExpresionStmt,
        'asignacion': nodos.Asignacion,
        'bloque': nodos.Bloque,
        'if': nodos.If,
        'while': nodos.While,
        'cadena': nodos.Cadena
    }

    const nodo = new tipos[tipoNodo](props)
    nodo.location = location()
    return nodo
    }
}


programa = _ dcl:Declaracion* _ { return dcl }


Declaracion = dcl:VarDcl _ { return dcl }

            / stmt:Stmt _ { return stmt }


VarDcl = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('declaracionVariable', { id, exp }) }


Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return crearNodo('print', { exp }) }

    / exp:Expresion _ ";" { return crearNodo('expresionStmt', { exp }) }

    / "{" _ dcls:Declaracion* _ "}" { return crearNodo('bloque', { dcls }) }

    / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt 
        stmtFalse:(
        _ "else" _ stmtFalse:Stmt { return stmtFalse } 
        )? { return crearNodo('if', { cond, stmtTrue, stmtFalse }) }

    / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('while', { cond, stmt }) }


Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }


Expresion = Asignacion


Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('asignacion', { id, asgn }) }
            
            / Comparacion

            / Cadena


Comparacion = izq:Suma expansion:(_ op:("<=") _ der:Suma { return { tipo: op, der } })* 
{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual

        // verificar si es una operacion entre cadenas
        if(tipo ==="+" && typeof operacionAnterior.valor === 'string' && typeof der.valor === 'string'){
            return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
        }

        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Suma = izq:Multiplicacion expansion:( _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } })* 

        // izq: Cadena expansion:( _ op:("+" / "-") _ der: Cadena { return { tipo: op, der } })*
{ 
    return expansion.reduce(
    (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
    },
    izq
    )
}


Multiplicacion = izq:Unaria expansion:(_ op:("*" / "/") _ der:Unaria { return { tipo: op, der } })* 
{
    return expansion.reduce(
        (operacionAnterior, operacionActual) => {
        const { tipo, der } = operacionActual
        return crearNodo('binaria', { op:tipo, izq: operacionAnterior, der })
        },
        izq
    )
}


Unaria = "-" _ num:Numero { return crearNodo('unaria', { op: '-', exp: num }) }
    
    / Numero

    / Cadena



// { return{ tipo: "numero", valor: parseFloat(text(), 10) } }
Numero = [0-9]+( "." [0-9]+ )? {return crearNodo('numero', { valor: parseFloat(text(), 10) })}

    / "(" _ exp:Expresion _ ")" { return crearNodo('agrupacion', { exp }) }

    / id:Identificador { return crearNodo('referenciaVariable', { id }) }



// nueva regla para cadenas de texcto con secuencias de escape
Cadena = "\"" chars: Caracteres* "\"" {return crearNodo('cadena', {valor: chars.join('')})}


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


// Ignorar espacios en blanco y comentarios, tanto de una línea como multilínea
_ = ([ \t\n\r] /comentarios / comentariosMultilinea )*
comentarios = "//" [^\n]* "\n" { return null }
comentariosMultilinea = "/*" (!"*/" .)* "*/" { return null }