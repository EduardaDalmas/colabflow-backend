const crypto = require('crypto');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Deve ser uma string de 256 bits (32 caracteres)
const IV_LENGTH = 16; 

function encryptMessage(text) {
    const iv = crypto.randomBytes(IV_LENGTH); // Gera um IV aleatório
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv); // Cria um objeto de cifra usando a chave e o IV
    let encrypted = cipher.update(text, 'utf8', 'hex'); // Atualiza a cifra com o texto a ser criptografado
    encrypted += cipher.final('hex'); // Finaliza a cifra e retorna o texto criptografado
    return iv.toString('hex') + ':' + encrypted; // Retorna o IV e o texto criptografado separados por ':'
}

function decryptMessage(encryptedText){
    const textParts = encryptedText.split(':'); // Divide o texto criptografado em IV e texto criptografado
    const iv = Buffer.from(textParts.shift(), 'hex'); // Converte o IV de hexadecimal para Buffer
    const encryptedMessage = textParts.join(':'); // Junta o texto criptografado
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv); // Cria um objeto de decifra usando a chave e o IV
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8'); // Atualiza a decifra com o texto criptografado
    decrypted += decipher.final('utf8'); // Finaliza a decifra e retorna o texto decifrado
    return decrypted; // Retorna o texto decifrado
}

module.exports = { encryptMessage, decryptMessage }; 