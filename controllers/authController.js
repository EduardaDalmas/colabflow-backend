// controllers/AuthController.js
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const secret = 'sua_chave_secreta';
const crypto = require('crypto');
const moment = require('moment');
const { sendEmail } = require('./mailController');


// Função para gerar e armazenar o OTP criptografado no banco de dados
async function generateAndStoreOTP(userId, db) {
  // Gera o OTP de 6 dígitos
  const otp = crypto.randomInt(100000, 999999).toString();

  // Criptografa o OTP
  const hashedOTP = await bcrypt.hash(otp, 10);

  // Define a data de criação e expiração (expiração de 1 hora a partir de agora)
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
  const expiresAt = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

  // Salva o OTP criptografado no banco de dados
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO otp (id_user, otp, created_at, expires_at) VALUES (?, ?, ?, ?)',
      [userId, hashedOTP, createdAt, expiresAt],
      (err) => {
        if (err) {
          console.error('Erro ao salvar o OTP no banco de dados:', err);
          reject('Erro ao gerar OTP');
        } else {
          console.log(`OTP gerado para o usuário ID ${userId}: ${otp}`); // Simula o envio por e-mail
          resolve(otp); // Retorna o OTP para o envio por e-mail
        }
      }
    );
  });
}


exports.verifyOTP = async (req, res) => {
  const { otp, email } = req.body;

  //consulta o usuário no banco de dados com base no e-mail
  const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  const user = results[0];

  // Excessão para um unico usuário ignorando o OTP real
  if (email === 'adriellyhomem@ienh.com.br' && otp === '000000') {
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, secret, { expiresIn: 86400 }); // 24 horas
    return res.status(200).send({
      auth: true,
      token: token,
      user: { id: user.id, name: user.name, email: user.email },
      message: 'OTP verificado com sucesso'
    });
  }


  try {

    // Consulta o OTP no banco de dados
    const [otpResults] = await db.promise().query('SELECT * FROM otp WHERE id_user = ? ORDER BY id DESC LIMIT 1', [results[0].id]);

    if (otpResults.length === 0) {
      return res.status(404).send('OTP não encontrado');
    }

    const otpData = otpResults[0];

    // Verifica se o OTP está expirado
    if (moment().isAfter(otpData.expires_at)) {
      return res.status(401).send('OTP expirado');
    }

    // Verifica se o OTP já foi utilizado
    if (otpData.deleted_at != null) {
      return res.status(401).send('OTP já utilizado');
    }

    // Compara o OTP informado com o OTP criptografado no banco de dados
    const isValid = await bcrypt.compare(otp, otpData.otp);

    if (!isValid) {
      return res.status(401).send('OTP inválido');
    }

    // se for válido, atualiza o registro do OTP no banco de dados
    await db.promise().query('UPDATE otp SET deleted_at = ? WHERE id = ?', [moment().format('YYYY-MM-DD HH:mm:ss'), otpData.id]);
    // Gera o token JWT
    const payload = { id: user.id, email: user.email, name: user.name };
    const token = jwt.sign(payload, secret, { expiresIn: 86400 }); // 24 horas

    //executa query para consultar o numero de perfis do usuario
    // const [profiles] = await db.promise().query('SELECT COUNT(*) as total FROM profiles WHERE id_user = ?', [user.id]);
    // Executa uma query para consultar o número de perfis e o ID, caso exista apenas um perfil
    const [result] = await db.promise().query(`
      SELECT id, 
            (SELECT COUNT(*) FROM profiles WHERE id_user = ?) AS total
      FROM profiles 
      WHERE id_user = ? 
      LIMIT 1
    `, [user.id, user.id]);

    // Se houver apenas um perfil, retorna o id; caso contrário, retorna null ou uma mensagem
    // const profileId = result[0].total === 1 ? result[0].id : null;
    const profileId = result.length > 0 && result[0].total === 1 ? result[0].id : null;
    console.log('id do profile',profileId);

    // Retorna uma resposta de sucesso
    return res.status(200).send({
      auth: true,
      token: token,
      user: { id: user.id, name: user.name, email: user.email, profiles: profileId },
      message: 'OTP verificado com sucesso'
    });


  } catch (error) {
    console.error('Erro ao verificar OTP:', error);
    return res.status(500).send('Erro ao verificar OTP');
  }
};


// Função para login
exports.login = async (req, res) => {
  const { email } = req.body;

  try {
    // Consulta o usuário no banco de dados
    const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    // Verifica se o usuário está ativo
    if (results[0].deleted_at != null) {
      return res.status(401).send('Usuário desativado');
    }

    const user = results[0];

    // Gera o token JWT
    // const payload = { id: user.id, email: user.email, name: user.name };
    // const token = jwt.sign(payload, secret, { expiresIn: 86400 }); // 24 horas

    // Gera e armazena o OTP no banco
    const otp = await generateAndStoreOTP(user.id, db);
    const templateData = { otp }; 

    // Envia o OTP para o e-mail do usuário
    await sendEmail(email, 'Seu código OTP', './views/layouts/otp-template.hbs', templateData); 

    // Envia a resposta final com token e dados do usuário
    return res.status(200).send({
      // auth: true,
      // token: token,
      user: { id: user.id, name: user.name, email: user.email },
      message: 'OTP enviado para seu e-mail!'
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).send('Erro ao processar login');
  }
};


// Função para registro
exports.register = (req, res) => {
  const { name, email } = req.body;
  console.log(req.body);

  // Primeiro, insere o usuário no banco de dados
  db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], async (err, result) => {
    if (err) {
      console.error('Erro ao registrar usuário:', err);
      return res.status(500).send('Erro ao registrar usuário');
    }

    const userId = result.insertId; // Pega o ID do usuário recém-criado

    try {

      //cria um profile default para o usuario, com o nome dele
      db.query('INSERT INTO profiles (id_user, description) VALUES (?, ?)', [userId, name], (err, result) => {
        if (err) {
          console.error('Erro ao criar perfil:', err);
          return res.status(500).send('Erro ao criar perfil');
        }
      });
      




      // Gera e armazena o OTP para o usuário recém-criado
      const otp = await generateAndStoreOTP(userId, db);

      const templateData = { otp }; 

  


      // Envia o OTP para o e-mail do usuário
      await sendEmail(email, 'Seu código OTP', './views/layouts/otp-template.hbs', templateData); 

      // Retorna uma resposta de sucesso junto com uma mensagem de confirmação
      return res.status(200).send({
        user: { id: userId, name: result.name, email: result.email },
        message: 'Usuário registrado com sucesso. Verifique o código enviado para seu e-mail.'
      });
    } catch (error) {
      console.error('Erro ao gerar OTP:', error);
      res.status(500).send('Erro ao gerar o código OTP');
    }
  });
};

  