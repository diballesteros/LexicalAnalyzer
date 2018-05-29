function lex () {

    var input = document.getElementById("textoAGuardar").value;

    let validarOperador = function (c) { return /[+\-*\/\^%=(),;<>{}[]/.test(c); };
    let validarDigito = function (c) { return /[0-9]/.test(c); };
    let validarEspacio = function (c) { return /\s/.test(c); };
    let validarVariable = function (c) { return typeof c === "string" && !validarOperador(c) && !validarDigito(c) && !validarEspacio(c); };

    let palabras = ['for', 'var', 'while', 'if', 'boolean', 'double', 'false', 'true', 'null'];

    var tokens = []
    var c = 0;
    var i = 0;

    var avanzar = function () { return c = input[++i]; };
    var agregarToken = function (token, valor) {
        tokens.push({
            token: token,
            valor: valor
        });
    };
    while (i < input.length) {
        c = input[i];
        if (validarEspacio(c)) {
            avanzar();
        }
        else if (validarOperador(c)) {
            agregarToken("operador", c);
            avanzar();
        }
        else if (validarDigito(c)) {
            let num = c;
            while (validarDigito(avanzar())) num += c;
            if (c === ".") {
                do num += c; while (validarDigito(avanzar()));
            }
            num = parseFloat(num);
            agregarToken("numero", num);
        }
        else if (validarVariable(c)) {
            let idn = c;
            while (validarVariable(avanzar())) idn += c;
            if (palabras.includes(idn)) {
                agregarToken("palabra reservada", idn)
            } else {
                agregarToken("variable", idn);
            }
        }
        else throw "No reconocido";

    }
    console.log(tokens)
    return tokens;
};

function guardarTextoComoArchivo()
{
    var texto = document.getElementById("textoAGuardar").value;
    var textoBlob = new Blob([texto], {type:"text/plain"});
    var textoURL = window.URL.createObjectURL(textoBlob);
    var nombreArchivoAGuardar = document.getElementById("nombreArchivoAGuardar").value;
 
    var linkDescarga = document.createElement("a");
    linkDescarga.download = nombreArchivoAGuardar;
    linkDescarga.innerHTML = "Descargar Archivo";
    linkDescarga.href = textoURL;
    linkDescarga.onclick = destruirElemento;
    linkDescarga.style.display = "none";
    document.body.appendChild(linkDescarga);
 
    linkDescarga.click();
}
 
function destruirElemento(event)
{
    document.body.removeChild(event.target);
}
 
function cargarArchivo()
{
    var archivoCargado= document.getElementById("archivoACargar").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(event) 
    {
        var textoCargado = event.target.result;
        document.getElementById("textoAGuardar").value = textoCargado;
    };
    fileReader.readAsText(archivoCargado, "UTF-8");
}