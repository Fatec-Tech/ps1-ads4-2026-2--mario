
# Atividade 07a - Homologação da API com cURL
# API: Clínica - Render

# 1. GET - Listar todos os pacientes
curl.exe -i -X GET "https://api-clinica-mario.onrender.com/pacientes"

# 2. POST - Cadastrar paciente
# O arquivo body.json contém os dados do paciente.
# JSON: {"nome":"Paciente Teste CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}

curl.exe -i -X POST "https://api-clinica-mario.onrender.com/pacientes" `
-H "Content-Type: application/json" `
--data-binary "@body.json"

# 3. GET - Buscar paciente por ID
curl.exe -i -X GET "https://api-clinica-mario.onrender.com/pacientes/4"

# 4. PUT - Atualizar paciente
# JSON: {"nome":"Paciente Atualizado CLI","email":"teste.cli@email.com","nascimento":"1998-05-20"}

curl.exe -i -X PUT "https://api-clinica-mario.onrender.com/pacientes/4" `
-H "Content-Type: application/json" `
--data-binary "@body.json"

# 5. DELETE - Remover paciente
curl.exe -i -X DELETE "https://api-clinica-mario.onrender.com/pacientes/4"

# Resultados obtidos:
# GET: 200 OK
# POST: 201 Created
# GET por ID: 200 OK
# PUT: 200 OK
# DELETE: 204 No Content
