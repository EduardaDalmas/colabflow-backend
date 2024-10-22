const db = require('../config/db');

exports.createLink = (req, res) => {
    const { id_chat, id_user, link } = req.body;

    db.query('INSERT INTO `important_links` (id_chat, id_user, link) VALUES (?, ?, ?)', [id_chat, id_user, link], (err, result) => {
    if (err) {
            console.error('Erro ao cadastrar link:', err);
            return res.status(500).send('Erro ao cadastrar link');
        }
        res.status(201).send('Link cadastrado com sucesso');
    });

}


exports.getLinksByChatId = (req, res) => {
    const id_chat = req.params.id_chat;

    db.query('SELECT * FROM `important_links` WHERE id_chat = ?', [id_chat], (err, results) => {
    if (err) {
            console.error('Erro ao buscar links:', err);
            return res.status(500).send('Erro ao buscar links');
        }
        if (results.length === 0) {
            return res.status(404).send('Links não encontrados');
        }

        const formattedResults = results.map(link => ({
            id: link.id,
            link: link.link,  
        }));

        res.json(formattedResults);  // Retorna os perfis formatados
    });
};

exports.deleteLink = (req, res) => {
    const id = req.params.id;

    db.query('DELETE FROM `important_links` WHERE id = ?', [id], (err, result) => {
    if (err) {
            console.error('Erro ao deletar link:', err);
            return res.status(500).send('Erro ao deletar link');
        }
        res.status(200).send('Link deletado com sucesso');
    });
}

