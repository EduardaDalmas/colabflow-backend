const db = require('../config/db');

// Função para criar um novo grupo
exports.createGroup = (req, res) => {
    const { name, id_context, id_user, id_priority } = req.body;

    db.query(
        'INSERT INTO `groups` (name, id_context, id_user, id_priority) VALUES (?, ?, ?, ?)', 
        [name, id_context, id_user, id_priority], 
        (err, result) => {
            if (err) {
                console.error('Erro ao criar grupo:', err);
                return res.status(500).send('Erro ao criar grupo');
            }
            res.status(201).send('Grupo criado com sucesso');
        }
    );
}

// Função para buscar grupos pelo ID do usuário
exports.getGroupByUserId = (req, res) => {
    const id_user = req.params.id_user;
    const id_context = req.params.id_context;

    db.query(
        `SELECT 
            groups.id, 
            groups.name, 
            groups.id_user,
            priorities.id AS priority_id, 
            priorities.name AS priority_name,
            COUNT(nr.id) AS unread_message_count
        FROM \`groups\`
        INNER JOIN priorities ON groups.id_priority = priorities.id
        LEFT JOIN chats c ON groups.id = c.id_group
        LEFT JOIN notifications n ON c.id = n.chat_id
        LEFT JOIN notification_reads nr ON n.id = nr.notification_id 
            AND nr.read_at IS NULL 
            AND nr.user_id = ?  -- Aqui filtra pelas notificações do usuário
        WHERE groups.id_user = ? 
        AND groups.id_context = ? 
        AND groups.deleted_at IS NULL
        GROUP BY groups.id, groups.name, groups.id_user, priorities.id, priorities.name`,
        [id_user, id_user, id_context],
        (err, results) => {
            if (err) {
                console.error('Erro ao buscar grupos:', err);
                return res.status(500).send('Erro ao buscar grupos');
            }
            if (results.length === 0) {
                return res.status(404).send('Grupo não encontrado');
            }



                

            // Mapear os resultados para o formato esperado
            const formattedResults = results.map(group => ({
                id: group.id,
                name: group.name,  
                priority: {
                    id: group.priority_id,
                    name: group.priority_name
                },
                id_owner: group.id_user,
                unread_message_count: group.unread_message_count
            }));

            console.log('formattedResults:', formattedResults);

            res.json(formattedResults);
        }
    );
};

// Função para buscar grupos que possuem chats onde o usuário participa, com contagem de notificações não lidas
exports.getGroupByChatUser = (req, res) => {
    const id_user = req.params.id_user;

    db.query(`
        SELECT DISTINCT 
            g.id, 
            g.name, 
            g.id_priority, 
            p.name AS priority_name,
            COUNT(nr.id) AS unread_message_count  -- Contagem de notificações não lidas
        FROM \`groups\` g
        JOIN chats c ON g.id = c.id_group
        JOIN user_chat uc ON c.id = uc.id_chat
        JOIN priorities p ON g.id_priority = p.id
        LEFT JOIN notifications n ON c.id = n.chat_id
        LEFT JOIN notification_reads nr ON n.id = nr.notification_id 
            AND nr.read_at IS NULL  -- Verifica se a notificação não foi lida
            AND nr.user_id = ?  -- Filtra as notificações do usuário
        WHERE uc.id_user = ? 
        AND g.id_user != ?  -- Exclui grupos onde o usuário é o dono
        GROUP BY g.id, g.name, g.id_priority, p.name
    `, [id_user, id_user, id_user], (err, results) => {        
        if (err) {
            console.error('Erro ao buscar grupos:', err);
            return res.status(500).send('Erro ao buscar grupos');
        }
        if (results.length === 0) {
            console.log('id_user:', id_user);
            return res.status(404).send('Grupo não encontrado');
        }

        // Mapear os resultados para o formato esperado, incluindo a contagem de notificações
        const formattedResults = results.map(group => ({
            id: group.id,
            name: group.name,  // Nome do grupo
            priority: {
                id: group.id_priority, // ID da prioridade
                name: group.priority_name // Nome da prioridade
            },
            unread_message_count: group.unread_message_count  // Contagem de notificações não lidas
        }));

        res.json(formattedResults);  // Retorna os grupos formatados
    });
};





// exports.getGroupByChatUser = (req, res) => {
//     const id_user = parseInt(req.params.id_user, 10);  // Converte para número


//     db.query(
//         `
//         SELECT DISTINCT c.id, c.name, c.id_user, c.id_priority, g.id_user AS group_owner
//         FROM \`chats\` c
//         LEFT JOIN user_chat uc ON c.id = uc.id_chat
//         LEFT JOIN \`groups\` g ON c.id_group = g.id
//         WHERE c.id_group = ?
//         AND (c.id_user = ? OR uc.id_user = ?);
//         `,
//         [id_user, id_user], 
//         (err, results) => {
//             if (err) {
//                 console.error('Erro ao buscar chats:', err);
//                 return res.status(500).send('Erro ao buscar chats');
//             }
//             res.json(results);
//         }
//     );
    
// };



// Função para editar um grupo
exports.editGroup = (req, res) => {
    const { name, id_user, id } = req.body;

    db.query(
        'UPDATE `groups` SET name = ?, id_user = ? WHERE id = ?',
        [name, id_user, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao editar grupo:', err);
                return res.status(500).send('Erro ao editar grupo');
            }
            res.status(200).send('Grupo editado com sucesso');
        }
    );
}

// Função para deletar um grupo (soft delete)
exports.deleteGroup = (req, res) => {
    const { id } = req.body;

    db.query(
        'UPDATE `groups` SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.error('Erro ao deletar grupo:', err);
                return res.status(500).send('Erro ao deletar grupo');
            }
            res.status(200).send('Grupo deletado com sucesso');
        }
    );
}

// Função para buscar o dono de um grupo
exports.getGroupOwner = (req, res) => {
    const id_group = req.params.id_group;

    db.query(
        'SELECT id_user FROM `groups` WHERE id = ?',
        [id_group],
        (err, results) => {
            if (err) {
                console.error('Erro ao buscar dono do grupo:', err);
                return res.status(500).send('Erro ao buscar dono do grupo');
            }
            if (results.length === 0) {
                return res.status(404).send('Dono do Grupo não encontrado');
            }

            res.json({ id_user: results[0].id_user });  // Retorna o id do dono do grupo
        }
    );
};
