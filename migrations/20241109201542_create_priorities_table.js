exports.up = function (knex) {
  // Verifica se as prioridades já existem na tabela
  return knex('priorities').count('id as count').first().then((result) => {
    if (result.count > 0) {
      console.log('Valores já existem, inserção ignorada.');
      return; // Não insere nada se já houver registros
    } else {
      // Insere as prioridades sem a coluna 'color'
      return knex('priorities').insert([
        { id: 1, name: 'Urgente' },
        { id: 2, name: 'Alta' },
        { id: 3, name: 'Média' },
        { id: 4, name: 'Baixa' },
      ]);
    }
  });
};

exports.down = function (knex) {
  // Não há nenhuma alteração para desfazer, já que não estamos fazendo mudanças no esquema da tabela
};
