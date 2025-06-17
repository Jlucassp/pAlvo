require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Conexão com o Firebase
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('API do pAlvo está funcionando e conectada ao Firebase!');
});

// ROTA PARA CRIAR UM NOVO OBJETIVO
app.post('/api/objetivos', async (req, res) => {
    try {
        const novoObjetivo = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            progresso: 0,
            subtarefas: [],
            // IMPORTANTE: Futuramente, adicionar o ID do usuário aqui
            // userId: "id_do_usuario_logado"
            criadoEm: new Date().toISOString()
        };

        // Adiciona o novo objetivo à coleção "objetivos" no Firestore
        const docRef = await db.collection('objetivos').add(novoObjetivo);

        // Retorna uma resposta de sucesso com o ID do novo documento
        res.status(201).send({ id: docRef.id, ...novoObjetivo });
    } catch (error) {
        console.error("Erro ao criar objetivo:", error);
        res.status(500).send("Erro no servidor ao criar o objetivo.");
    }
});

// ROTA PARA LER TODOS OS OBJETIVOS
app.get('/api/objetivos', async (req, res) => {
    try {
        const snapshot = await db.collection('objetivos').get();
        const objetivos = [];
        snapshot.forEach(doc => {
            objetivos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.status(200).send(objetivos);
    } catch (error) {
        console.error("Erro ao buscar objetivos:", error);
        res.status(500).send("Erro no servidor ao buscar os objetivos.");
    }
});

// ROTA PARA ATUALIZAR UM OBJETIVO (UPDATE)
app.put('/api/objetivos/:id', async (req, res) => {
    try {
        const idDoDocumento = req.params.id;
        const dadosParaAtualizar = req.body;

        await db.collection('objetivos').doc(idDoDocumento).update(dadosParaAtualizar);

        res.status(200).send({ id: idDoDocumento, ...dadosParaAtualizar });
    } catch (error) {
        console.error("Erro ao atualizar objetivo:", error);
        res.status(500).send("Erro no servidor ao atualizar o objetivo.");
    }
});

// ROTA PARA DELETAR UM OBJETIVO (DELETE)
app.delete('/api/objetivos/:id', async (req, res) => {
    try {
        const idDoDocumento = req.params.id;
        await db.collection('objetivos').doc(idDoDocumento).delete();

        res.status(200).send(`Objetivo com ID ${idDoDocumento} deletado com sucesso.`);
    } catch (error) {
        console.error("Erro ao deletar objetivo:", error);
        res.status(500).send("Erro no servidor ao deletar o objetivo.");
    }
});

// ROTA PARA ADICIONAR UMA SUBTAREFA A UM OBJETIVO
app.post('/api/objetivos/:id/subtarefas', async (req, res) => {
    try {
        const idDoObjetivo = req.params.id;
        const novaSubtarefa = {
            // É uma boa prática gerar um ID único para a subtarefa também
            id: new Date().getTime().toString(), // Um ID simples baseado no tempo
            descricao: req.body.descricao,
            concluida: false
        };

        const objetivoRef = db.collection('objetivos').doc(idDoObjetivo);

        // Usa o arrayUnion para adicionar a nova subtarefa ao array existente
        await objetivoRef.update({
            subtarefas: admin.firestore.FieldValue.arrayUnion(novaSubtarefa)
        });

        res.status(200).send(novaSubtarefa);

    } catch (error) {
        console.error("Erro ao adicionar subtarefa:", error);
        res.status(500).send("Erro no servidor ao adicionar a subtarefa.");
    }
});

// ROTA PARA ATUALIZAR UMA SUBTAREFA ESPECÍFICA
app.put('/api/objetivos/:id/subtarefas/:subtarefaId', async (req, res) => {
    try {
        const { id, subtarefaId } = req.params;
        const dadosParaAtualizar = req.body; // Ex: { "concluida": true }

        const objetivoRef = db.collection('objetivos').doc(id);
        const doc = await objetivoRef.get();

        if (!doc.exists) {
            return res.status(404).send('Objetivo não encontrado');
        }

        const objetivo = doc.data();
        const subtarefasAtualizadas = objetivo.subtarefas.map(sub => {
            if (sub.id === subtarefaId) {
                // Retorna a subtarefa com os campos atualizados
                return { ...sub, ...dadosParaAtualizar };
            }
            return sub;
        });

        await objetivoRef.update({ subtarefas: subtarefasAtualizadas });

        res.status(200).send(subtarefasAtualizadas);

    } catch (error) {
        console.error("Erro ao atualizar subtarefa:", error);
        res.status(500).send("Erro no servidor ao atualizar a subtarefa.");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});