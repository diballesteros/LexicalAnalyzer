/*
Funcion lex
Analiza el codigo lexicamente
*/
function lex() {

    //Instanciar el input, extraerlo del elemento textAGuardar del codigo HTML
    var input = document.getElementById("textoAGuardar").value;

    // Funciones encargadas con validar el tipo de caracter mientras que lee el texto

    //Expression regex para los diferentes operadores
    var validarOperador = function (c) { return /[+\-*\/\^%=(),;<>{}[]/.test(c); };
    //Expresion regex para los digitos
    var validarDigito = function (c) { return /[0-9]/.test(c); };
    //Expresion regex para espacio en blanco
    var validarEspacio = function (c) { return /\s/.test(c); };
    // Validar si es string y diferente a los otros validaciones
    var validarVariable = function (c) { return typeof c === "string" && !validarOperador(c) && !validarDigito(c) && !validarEspacio(c); };

    // Palabras reservadas de javascript: https://www.w3schools.com/js/js_reserved.asp
    let palabras = ['for', 'var', 'while', 'if', 'boolean', 'double', 'false', 'true', 'null', 'abstract', 'break', 'char', 'debugger', 'export', 'finally', 'goto', 'in', 'let',
        'public', 'super', 'throw', 'try', 'volatile', 'arguments', 'byte', 'class', 'default', 'else', 'extends', 'float', 'instanceof', 'long', 'package', 'return', 'switch',
        'throws', 'typeof', 'await', 'case', 'const', 'delete', 'enum', 'false', 'for', 'implements', 'int', 'native', 'private', 'short', 'synchronized', 'transient', 'with',
        'catch', 'continue', 'do', 'eval', 'final', 'import', 'function', 'interface', 'new', 'protected', 'static', 'this', 'void', 'yield'];

    /*
    Instanciar los variables
        tokens: Arreglo que contiene objetos de atributos token, valor cada vez que se lea un elemento del texto
        c: el caracter actual para validar contra las funciones
        i: variable que determina la posicion en que se esta leyend el texto
    */
    var tokens = []
    var c = 0;
    var i = 0;

    //Funcion para seguir avanzando por el texto
    var avanzar = function () { return c = input[++i]; };

    //Funcion que dependiendo del token y valor agregarlo al arreglo de tokens
    var agregarToken = function (token, valor) {
        tokens.push({
            token: token,
            valor: valor
        });
    };
    // Mientras que halla caracteres seguir recorriendo el texto
    while (i < input.length) {

        // Sacar el caracter actual del texto
        c = input[i];
        // Si es espacio en blanco saltar
        if (validarEspacio(c)) {
            avanzar();
        }

        // Llamar funcion para validar si es operador y llamar funcion para agregar a tokens
        else if (validarOperador(c)) {
            agregarToken("operador", c);
            avanzar();
        }
        // Llamar funcion para validar si es digito, si son multiples digitos o contiene decimal contar como un unico elemento
        else if (validarDigito(c)) {
            var num = c;
            while (validarDigito(avanzar())) num += c;
            if (c === ".") {
                do num += c; while (validarDigito(avanzar()));
            }
            // Sacar el float del digito que se va agregar a tokens
            num = parseFloat(num);
            agregarToken("numero", num);
        }
        // Llamar funcion para validar si es variable, tambien comprobar si es una palabra reservada
        else if (validarVariable(c)) {
            var idn = c;
            while (validarVariable(avanzar())) idn += c;
            if (palabras.includes(idn)) {
                agregarToken("palabra reservada", idn)
            } else {
                agregarToken("variable", idn);
            }
        }
        //Si no ee encuentra ninguna validacion botar error
        else throw "No reconocido";

    }

    // Convertir arreglo de objetos como un string para imprimir los resultados en HTML
    document.getElementById("resultados").innerHTML = JSON.stringify(tokens);

    // Retornar el arreglo
    return tokens;
};

/*
Funcion guardarTextoComoArchivo
se encarga de convertir el texto para poder descargarlo como .txt
*/
function guardarTextoComoArchivo() {
    // Sacar el texto que actualmente esta en el area de texto
    var texto = document.getElementById("textoAGuardar").value;

    // Convertir el texto en un tipo de data BLOB
    var textoBlob = new Blob([texto], { type: "text/plain" });
    // Crear el URL para descargar el archivo con el BLOB
    var textoURL = window.URL.createObjectURL(textoBlob);
    //Sacar el nombre que el usuario quiera asignar al archivo
    var nombreArchivoAGuardar = document.getElementById("nombreArchivoAGuardar").value;

    // Crear elemento para construir el link de descarga
    var linkDescarga = document.createElement("a");
    // Crear el atributo de descarga con el URL y agregar .txt para descargarlo de formato correcto
    linkDescarga.download = nombreArchivoAGuardar + ".txt";
    // Configuraciones internas del HTML para que funcione como link de descarga
    linkDescarga.innerHTML = "Descargar Archivo";
    // Apuntar el elemento HTML creado al URL creada
    linkDescarga.href = textoURL;
    // Despues de hacerle click al element destruirlo para volver a descargar
    linkDescarga.onclick = destruirElemento;
    // Omitir estilos para mantener mismo boton
    linkDescarga.style.display = "none";
    //Agregar link de descarga al codigo HTML
    document.body.appendChild(linkDescarga);

    // Hacer el llamado de click para iniciar la descarga
    linkDescarga.click();
}

// Funcion para destruir elemento despues de descarga
function destruirElemento(event) {
    document.body.removeChild(event.target);
}


/*
Funcion cargarArchivo
*/
function cargarArchivo() {

    // Cargar archivo seleccionado por elemento HTML
    var archivoCargado = document.getElementById("archivoACargar").files[0];

    // Utilizar funcion generica filereader para leer el archivo y agregar contenido a area de texto
    var fileReader = new FileReader();
    fileReader.onload = function (event) {
        var textoCargado = event.target.result;
        document.getElementById("textoAGuardar").value = textoCargado;
    };
    fileReader.readAsText(archivoCargado, "UTF-8");
}