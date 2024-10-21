const nodemailer = require('nodemailer');
const { create } = require('express-handlebars');
const path = require('path');
const fs = require('fs');

// Configuração do Handlebars
const hbs = create({
  extname: '.hbs',
  defaultLayout: false,
  layoutsDir: path.join(__dirname, 'views/layouts'), // Diretório dos layouts
  partialsDir: path.join(__dirname, 'views/partials') // Diretório dos partials
});

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para outros
  auth: {
    user: 'portalvagass@gmail.com',
    pass: 'zbgqzhropjbwozui',
  },
});

// Função para enviar e-mail
const sendEmail = async (to, subject, templateName, templateData) => {
  try {
    // Caminho para a imagem logo
    const logoPath = path.join(__dirname, '../views/layouts/logo.png');
    // Ler a imagem e convertê-la para Base64
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    // Adicionar a imagem ao templateData
    templateData.logo = `data:image/png;base64,${logoBase64}`;

    // Renderiza o template com Handlebars
    const htmlContent = await hbs.render(templateName, templateData);

    const mailOptions = {
      from: 'account@taskflow.com',
      to: to,
      subject: subject,
      html: htmlContent,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado para:', to);
    return { success: true, message: 'E-mail enviado' };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new Error('Erro ao enviar e-mail');
  }
};

// Exporta a função
module.exports = {
  sendEmail,
};