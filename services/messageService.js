const { encryptMessage } = require('../utils/cryptoUtils');
const { decryptMessage } = require('../utils/cryptoUtils');

const prepareMessage = (message) => {

    //criptografar o conteudo da mensagem
    const encryptedText = encryptMessage(message.text);
    return { ...message, text: encryptedText };

};

const decryptMessages = (message) => {
    //descriptografar o conteudo da mensagem
    const decryptedText = decryptMessage(message.text);
    return { ...message, text: decryptedText };
};

module.exports = { prepareMessage, decryptMessages };