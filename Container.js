class TypeContainer {
    static get initializers() {
        if (!TypeContainer._initializers) {
            TypeContainer._initializers = {};
        }

        return TypeContainer._initializers;
    }

    static get instances() {
        if (!TypeContainer._instances) {
            TypeContainer._instances = {};
        }

        return TypeContainer._instances;
    }

    static register(type, func) {
        TypeContainer.initializers[type] = func;
        TypeContainer.instances[type] = void 0;
    }

    static resolve(type) {
        if (TypeContainer.instances[type]) {
            return TypeContainer.instances[type];
        }
        
        if (TypeContainer.initializers[type]) {
            return TypeContainer.instances[type] = TypeContainer.initializers[type]();
        }

        return void 0; 
    }
}

