export class Entorno {

    /**
        * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} nombre
     * @param {any} exp
     */
    setVariable(nombre, {tipo, exp}) {
        // TODO: si algo ya está definido, lanzar error
        if(this.valores.hasOwnProperty(nombre)){
            throw new Error(`Variable ${nombre} ya definida`);
        }
        this.valores[nombre] = {tipo, exp};
    }

    /**
     * @param {string} nombre
     */
    getVariable(nombre) {
        const valorActual = this.valores[nombre];

        if (valorActual) return valorActual;

        if (!valorActual && this.padre) {
            return this.padre.getVariable(nombre);
        }

        throw new Error(`Variable ${nombre} no definida`); 
    }

    /**
   * @param {string} nombre
   * @param {any} exp
   */
    assignVariable(nombre, exp) {
        const valorActual = this.valores[nombre];

        if (valorActual) {
            this.valores[nombre] = exp;
            return;
        }

        if (!valorActual && this.padre) {
            this.padre.assignVariable(nombre, exp);
            return;
        }

        throw new Error(`Variable ${nombre} no definida`);
    }
}