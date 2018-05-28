let lex = function (input) {

    let isOperator = function (c) { return /[+\-*\/\^%=(),]/.test(c); };
    let isDigit = function (c) { return /[0-9]/.test(c); };
    let isWhiteSpace = function (c) { return /\s/.test(c); };
    let isIdentifier = function (c) { return typeof c === "string" && !isOperator(c) && !isDigit(c) && !isWhiteSpace(c); };

    let palabras = ['for', 'var', 'while', 'if', 'boolean', 'double', 'false', 'true', 'null'];

    var tokens = [], c, i = 0;
    var advance = function () { return c = input[++i]; };
    var addToken = function (type, value) {
        tokens.push({
            type: type,
            value: value
        });
    };
    while (i < input.length) {
        c = input[i];
        if (isWhiteSpace(c)) {
            advance();
        }
        else if (isOperator(c)) {
            addToken("operador", c);
            advance();
        }
        else if (isDigit(c)) {
            let num = c;
            while (isDigit(advance())) num += c;
            if (c === ".") {
                do num += c; while (isDigit(advance()));
            }
            num = parseFloat(num);
            if (!isFinite(num)) throw "Numero demasiado grande para un double de 64 bits";
            addToken("numero", num);
        }
        else if (isIdentifier(c)) {
            let idn = c;
            while (isIdentifier(advance())) idn += c;
            if (palabras.includes(idn)) {
                addToken("palabra reservada", idn)
            } else {
                addToken("variable", idn);
            }
        }
        else throw "No reconocido";

    }
    addToken("(end)");
    return tokens;
};

console.log(lex('for(var i = 0; i<10;i++){x=x+1}'))