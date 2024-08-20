programa 
    = izquierda:Numero "+" derecha: Numero {return izquierda+derecha;}//el guion bajo es para ignorar los espacios en blanco
    
Numero = [0-9]+ {return parseInt(text(),10);}//el 10 es para que lo tome como base 10