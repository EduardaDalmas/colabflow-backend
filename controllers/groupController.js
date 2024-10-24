const db = require('../config/db');

exports.createGroup = (req, res) => {
    const { name, id_context, id_user, id_priority } = req.body;

    db.query('INSERT INTO `groups` (name, id_context, id_user, id_priority) VALUES (?, ?, ?, ?)', [name, id_context, id_user, id_priority], (err, result) => {
        if (err) {
            console.error('Erro ao criar grupo:', err);
            return res.status(500).send('Erro ao criar grupo');
        }
        res.status(201).send('Grupo criado com sucesso');
    });

}


// Busca os grupos de acordo com o id do usuário e retorna JSON com id e name (dinâmico)
exports.getGroupByUserId = (req, res) => {
    const id_user = req.params.id_user;
    const id_context = req.params.id_context;

    // db.query('SELECT id, name FROM groups WHERE id_user = ?', [id_user], (err, results) => {
    db.query('SELECT id, name FROM `groups` WHERE id_user = ? AND id_context = ?', [id_user, id_context], (err, results) => {
        if (err) {
            console.error('Erro ao buscar grupos:', err);
            return res.status(500).send('Erro ao buscar grupos');
        }
        if (results.length === 0) {
            return res.status(404).send('Grupo não encontrado');
        }

        // Mapear os resultados para o formato esperado (id, name)
        const formattedResults = results.map(group => ({
            id: group.id,
            name: group.name,  // Ajuste para 'name'
        }));

        res.json(formattedResults);  // Retorna os perfis formatados
    });
};


// buscar grupos que possuem chats em que um usuário participa
exports.getGroupByChatUser = (req, res) => {
    const id_user = req.params.id_user;

    db.query('SELECT DISTINCT g.id, g.name FROM `groups` g JOIN chats c ON g.id = c.id_group JOIN user_chat uc ON c.id = uc.id_chat WHERE uc.id_user = ? AND g.id_user != ?', [id_user, id_user], (err, results) => {
        if (err) {
            console.error('Erro ao buscar grupos:', err);
            return res.status(500).send('Erro ao buscar grupos');
        }
        if (results.length === 0) {
            console.log('id_user:', id_user);
            return res.status(404).send('Grupo não encontrado');
        }   

        // Mapear os resultados para o formato esperado (id, name)
        const formattedResults = results.map(group => ({
            id: group.id,
            name: group.name,  // Ajuste para 'name'
        }));

        res.json(formattedResults);  // Retorna os perfis formatados
    });
};

