"use strict";

// Função para gerar código criptografado falso e realista
function generateFakeEncryptedCode() {
  var fakeCode = [];
  var base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var hexChars = "0123456789ABCDEF";
  var symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  
  // Gerar múltiplas linhas de código criptografado variado
  var lines = [];
  var totalLines = 80 + Math.floor(Math.random() * 40); // 80-120 linhas
  
  for (var i = 0; i < totalLines; i++) {
    var lineType = Math.floor(Math.random() * 3);
    var line = "";
    
    if (lineType === 0) {
      // Linha Base64
      for (var j = 0; j < 60 + Math.floor(Math.random() * 20); j++) {
        line += base64Chars.charAt(Math.floor(Math.random() * base64Chars.length));
      }
    } else if (lineType === 1) {
      // Linha Hexadecimal
      for (var k = 0; k < 50 + Math.floor(Math.random() * 20); k++) {
        line += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
      }
    } else {
      // Linha mista com símbolos
      for (var l = 0; l < 40 + Math.floor(Math.random() * 20); l++) {
        var charSet = base64Chars + symbols;
        line += charSet.charAt(Math.floor(Math.random() * charSet.length));
      }
    }
    
    lines.push(line);
  }
  
  var encrypted = lines.join("\n");
  
  // Cortar o código (mostrar apenas uma parte aleatória)
  var linesArray = encrypted.split("\n");
  var startLine = Math.floor(Math.random() * Math.max(0, linesArray.length - 30));
  var endLine = Math.min(startLine + 25, linesArray.length);
  var cutCode = linesArray.slice(startLine, endLine).join("\n");
  
  // Adicionar comentários de proteção
  var header = "<!-- =========================================== -->\n" +
               "<!-- CÓDIGO CRIPTOGRAFADO E PROTEGIDO -->\n" +
               "<!-- Este código foi ofuscado para proteção -->\n" +
               "<!-- Acesso não autorizado é proibido -->\n" +
               "<!-- =========================================== -->\n\n";
  
  var footer = "\n\n<!-- =========================================== -->\n" +
               "<!-- [CÓDIGO CORTADO POR SEGURANÇA] -->\n" +
               "<!-- O código completo está protegido e criptografado -->\n" +
               "<!-- Tentativas de acesso não autorizado serão registradas -->\n" +
               "<!-- =========================================== -->";
  
  return header + cutCode + "\n...\n[TRECHO REMOVIDO POR SEGURANÇA]\n..." + footer;
}

// Função de proteção contra Ctrl+U - Executa imediatamente
(function protectSourceCode() {
  "use strict";
  
  // Função para criar código criptografado (inline para execução imediata)
  function createFakeCode() {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=!@#$%^&*()_+-=[]{}|;:,.<>?";
    var code = [];
    for (var i = 0; i < 800; i++) {
      code.push(chars.charAt(Math.floor(Math.random() * chars.length)));
      if (i > 0 && i % 60 === 0) code.push("\n");
    }
    var cut = code.join("").substring(100, 350);
    return "<!-- CÓDIGO CRIPTOGRAFADO E PROTEGIDO -->\n" +
           "<!-- Este código foi ofuscado para proteção -->\n" +
           "<!-- Acesso não autorizado é proibido -->\n\n" +
           cut + "...\n\n" +
           "<!-- [CÓDIGO CORTADO POR SEGURANÇA] -->\n" +
           "<!-- O código completo está protegido e criptografado -->";
  }
  
  // Função handler para interceptar Ctrl+U
  function handleKeyDown(e) {
    try {
      // Detectar Ctrl+U (Windows/Linux) ou Cmd+U (Mac)
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.returnValue = false;
        
        // Criar nova janela com código criptografado
        try {
          var fakeWin = window.open("", "_blank", "width=800,height=600,scrollbars=yes");
          if (fakeWin) {
            fakeWin.document.write("<!DOCTYPE html><html><head><title>Código Fonte - Protegido</title><meta charset='UTF-8'><style>body{font-family:'Courier New',monospace;background:#1e1e1e;color:#d4d4d4;padding:20px;line-height:1.6}pre{background:#252526;padding:15px;border-radius:5px;border:1px solid #3e3e42;overflow-x:auto}.warning{color:#f48771;font-weight:bold;margin-bottom:15px}</style></head><body><div class='warning'>⚠️ CÓDIGO CRIPTOGRAFADO E PROTEGIDO</div><pre>" + createFakeCode() + "</pre></body></html>");
            fakeWin.document.close();
          }
        } catch (winErr) {
          // Ignorar se não conseguir abrir janela
        }
        
        return false;
      }
      
      // Proteger contra F12 e outras combinações
      if (e.key === "F12" || e.keyCode === 123 || 
          ((e.ctrlKey || e.metaKey) && e.shiftKey && 
           (e.key === "I" || e.key === "J" || e.key === "C" || 
            e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67))) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        return false;
      }
    } catch (err) {
      // Silenciosamente ignorar
    }
  }
  
  // Aplicar proteção imediatamente em múltiplos níveis
  // Nível 1: Window (mais abrangente)
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", function(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U" || e.keyCode === 85)) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = false;
        return false;
      }
    }, true);
  }
  
  // Nível 2: Document (quando disponível)
  if (typeof document !== "undefined") {
    document.addEventListener("keydown", handleKeyDown, true);
    
    // Também proteger quando o documento estiver pronto
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function() {
        document.addEventListener("keydown", handleKeyDown, true);
      }, false);
    } else {
      document.addEventListener("keydown", handleKeyDown, true);
    }
  }
  
  // Nível 3: Body (quando disponível)
  if (typeof document !== "undefined" && document.body) {
    document.body.addEventListener("keydown", handleKeyDown, true);
  } else if (typeof document !== "undefined") {
    // Aguardar body estar disponível
    var bodyCheck = setInterval(function() {
      if (document.body) {
        document.body.addEventListener("keydown", handleKeyDown, true);
        clearInterval(bodyCheck);
      }
    }, 50);
    
    // Timeout de segurança
    setTimeout(function() {
      clearInterval(bodyCheck);
    }, 5000);
  }
})();

// Proteção adicional via document.addEventListener (backup)
document.addEventListener("keydown", function(e) {
  try {
    // Detectar Ctrl+U ou Ctrl+Shift+U
    if ((e.ctrlKey || e.metaKey) && e.key === "u") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      // Criar nova janela com código criptografado
      var fakeWindow = window.open("", "_blank", "width=800,height=600,scrollbars=yes");
      if (fakeWindow) {
        fakeWindow.document.write("<!DOCTYPE html>\n<html>\n<head>\n");
        fakeWindow.document.write("<title>Código Fonte - Protegido</title>\n");
        fakeWindow.document.write("<meta charset='UTF-8'>\n");
        fakeWindow.document.write("<style>");
        fakeWindow.document.write("body { font-family: 'Courier New', monospace; background: #1e1e1e; color: #d4d4d4; padding: 20px; line-height: 1.6; }");
        fakeWindow.document.write("pre { background: #252526; padding: 15px; border-radius: 5px; border: 1px solid #3e3e42; overflow-x: auto; }");
        fakeWindow.document.write(".warning { color: #f48771; font-weight: bold; margin-bottom: 15px; }");
        fakeWindow.document.write("</style>\n</head>\n<body>\n");
        fakeWindow.document.write("<div class='warning'>⚠️ CÓDIGO CRIPTOGRAFADO E PROTEGIDO</div>\n");
        fakeWindow.document.write("<pre>" + generateFakeEncryptedCode() + "</pre>\n");
        fakeWindow.document.write("</body>\n</html>");
        fakeWindow.document.close();
      }
      
      return false;
    }
    
    // Também proteger contra F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (e.key === "F12" || 
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  } catch (err) {
    // Silenciosamente ignorar erros
  }
}, true);

// Proteção adicional: desabilitar menu de contexto apenas em áreas sensíveis
// (Comentado para não interferir na experiência do usuário)
// document.addEventListener("contextmenu", function(e) {
//   e.preventDefault();
//   return false;
// }, false);

document.addEventListener("DOMContentLoaded", function onDomReady() {
  try {
    // Ensure all target="_blank" links are safe
    var anchors = document.querySelectorAll('a[target="_blank"]');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var rel = (a.getAttribute("rel") || "").toLowerCase();
      if (rel.indexOf("noopener") === -1 || rel.indexOf("noreferrer") === -1) {
        var newRel = [];
        if (rel) newRel = rel.split(/\s+/).filter(Boolean);
        if (newRel.indexOf("noopener") === -1) newRel.push("noopener");
        if (newRel.indexOf("noreferrer") === -1) newRel.push("noreferrer");
        a.setAttribute("rel", newRel.join(" "));
      }
    }

    // Neutralize javascript: URLs which can be abused for XSS
    var allLinks = document.querySelectorAll("a[href]");
    for (var j = 0; j < allLinks.length; j++) {
      var link = allLinks[j];
      var href = link.getAttribute("href") || "";
      if (/^\s*javascript:/i.test(href)) {
        link.setAttribute("href", "#");
        link.setAttribute("aria-disabled", "true");
      }
    }

    // Basic form hardening: ensure autocomplete attributes are reasonable
    var passwordInputs = document.querySelectorAll('input[type="password"]');
    for (var k = 0; k < passwordInputs.length; k++) {
      var pwd = passwordInputs[k];
      if (!pwd.getAttribute("autocomplete")) {
        pwd.setAttribute("autocomplete", "current-password");
      }
      pwd.setAttribute("inputmode", "text");
    }

    // Disallow embedding in iframes if header is missing (defense in depth)
    try {
      if (window.top !== window.self) {
        window.top.location = window.self.location;
      }
    } catch (_) {
      // Ignore if cross-origin
    }
  } catch (e) {
    // Fail closed and avoid throwing
    console && console.warn && console.warn("Security hardening script encountered an issue:", e);
  }
});

