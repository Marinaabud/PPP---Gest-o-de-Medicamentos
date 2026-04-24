# Epico: Gestao de medicamentos receitados para uso domiciliar

## Objetivo do epico
Permitir que pacientes ou responsaveis registrem medicamentos receitados, acompanhem dosagens, horarios e prazo de tratamento, e visualizem com clareza quais medicamentos ainda estao em uso e quais ja foram finalizados.

## User stories

### US01 - Cadastro de conta
Como usuario
Quero criar uma conta com nome, e-mail e senha
Para acessar meu controle de medicamentos com seguranca.

### US02 - Login autenticado
Como usuario
Quero fazer login com JWT
Para acessar apenas os meus registros de medicamentos.

### US03 - Cadastro de medicamento
Como usuario autenticado
Quero cadastrar um medicamento com nome, quantidade, unidade, horarios e prazo
Para registrar corretamente o tratamento receitado.

### US04 - Listagem de medicamentos
Como usuario autenticado
Quero visualizar todos os meus medicamentos cadastrados
Para acompanhar o tratamento em uma unica tela.

### US05 - Filtro por status
Como usuario autenticado
Quero alternar entre medicamentos em uso e finalizados
Para identificar rapidamente o que ainda preciso tomar e o que ja acabou.

### US06 - Atualizacao do cadastro
Como usuario autenticado
Quero editar os dados de um medicamento
Para corrigir horarios, dosagem ou prazo quando necessario.

### US07 - Finalizacao manual do tratamento
Como usuario autenticado
Quero marcar um medicamento como finalizado
Para indicar que nao preciso mais toma-lo.

### US08 - Finalizacao automatica por prazo
Como usuario autenticado
Quero que o sistema identifique quando o prazo do tratamento terminou
Para mover automaticamente o medicamento para finalizado.

### US09 - Exclusao de medicamento
Como usuario autenticado
Quero remover um medicamento do meu controle
Para manter a lista atualizada.

### US10 - Consulta da documentacao da API
Como desenvolvedor
Quero acessar a documentacao Swagger em endpoint dedicado
Para entender rapidamente contratos, respostas e codigos de erro da API.

## Regras de negocio
1. Apenas usuarios autenticados podem acessar endpoints de medicamentos.
2. Cada usuario visualiza e altera apenas os seus proprios medicamentos.
3. O cadastro do medicamento deve conter nome, quantidade, unidade, horarios, prazo e data de inicio.
4. As unidades de dosagem aceitas sao: `capsula`, `gota`, `ml`, `comprimido` e `outro`.
5. O prazo do tratamento aceita `dias` ou `meses`.
6. O status inicial do medicamento e `em_uso`.
7. Um medicamento pode ser finalizado manualmente ou automaticamente quando o prazo expira.
8. O filtro de listagem aceita os status `em_uso` e `finalizado`.

## Criterios de aceitacao principais
1. Registro e login devem retornar token JWT valido.
2. Requisicoes sem token ou com token invalido devem retornar `401`.
3. O endpoint de cadastro deve persistir os dados em banco em memoria enquanto a aplicacao estiver ativa.
4. O endpoint de listagem deve permitir filtrar por status.
5. O endpoint de status deve permitir alternar entre `em_uso` e `finalizado`.
6. O Swagger deve estar disponivel em interface visual e em JSON.
