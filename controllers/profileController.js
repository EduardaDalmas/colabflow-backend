const db = require('../config/db');

exports.createProfile = (req, res) => {
    const { description, id_user } = req.body;

    db.query('INSERT INTO profiles (id_user, description) VALUES (?, ?)', [id_user, description], (err, result) => {
        if (err) {
            console.error('Erro ao criar perfil:', err);
            return res.status(500).send('Erro ao criar perfil');
        }
        res.status(201).send('Perfil criado com sucesso');
    });

}


// Busca os perfis de acordo com o id do usuário e retorna JSON com id e name (dinâmico)
exports.getProfileByUserId = (req, res) => {
    const id_user = req.params.id_user;

    db.query('SELECT id, description FROM profiles WHERE id_user = ?', [id_user], (err, results) => {
        if (err) {
            console.error('Erro ao buscar perfil:', err);
            return res.status(500).send('Erro ao buscar perfil');
        }
        if (results.length === 0) {
            return res.status(404).send('Perfil não encontrado');
        }

        // Mapear os resultados para o formato esperado (id, name)
        const formattedResults = results.map(profile => ({
            id: profile.id,
            name: profile.description,  // Ajuste para 'name'
        }));

        res.json(formattedResults);  // Retorna os perfis formatados
    });
};

