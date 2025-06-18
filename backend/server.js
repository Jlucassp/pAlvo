require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// --- Conexão com o Firebase ---
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// --- Funções Auxiliares Recursivas ---
const updateTaskInTree = (tasks, taskId, partialUpdate) => {
    return tasks.map(task => {
        if (task.id === taskId) return { ...task, ...partialUpdate };
        if (task.subtarefas) return { ...task, subtarefas: updateTaskInTree(task.subtarefas, taskId, partialUpdate) };
        return task;
    });
};
const deleteTaskInTree = (tasks, taskId) => {
    let newTasks = tasks.filter(task => task.id !== taskId);
    return newTasks.map(task => task.subtarefas ? { ...task, subtarefas: deleteTaskInTree(task.subtarefas, taskId) } : task);
};
const addSubtaskInTree = (tasks, parentId, newSubtask) => {
    return tasks.map(task => {
        if (task.id === parentId) {
            return { ...task, subtarefas: [...(task.subtarefas || []), newSubtask] };
        }
        if (task.subtarefas) {
            return { ...task, subtarefas: addSubtaskInTree(task.subtarefas, parentId, newSubtask) };
        }
        return task;
    });
};

// ======================
// --- ROTAS DA API ---
// ======================

// GET /api/objetivos - Lê todos os objetivos
app.get('/api/objetivos', async (req, res) => {
    try {
        const snapshot = await db.collection('objetivos').orderBy('criadoEm', 'desc').get();
        // CORREÇÃO: Garante que o ID do documento seja incluído na resposta de cada objetivo.
        const objetivos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).send(objetivos);
    } catch (error) { res.status(500).send(error.message); }
});

// GET /api/objetivos/:id - Lê UM objetivo específico
app.get('/api/objetivos/:id', async (req, res) => {
    try {
        const doc = await db.collection('objetivos').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).send('Objetivo não encontrado');
        // CORREÇÃO: Garante que o ID do documento seja incluído na resposta.
        res.status(200).send({ id: doc.id, ...doc.data() });
    } catch (error) { res.status(500).send(error.message); }
});

// POST /api/objetivos - Cria um novo objetivo principal
app.post('/api/objetivos', async (req, res) => {
    try {
        const docRef = db.collection('objetivos').doc();
        const novoObjetivo = {
            id: docRef.id,
            titulo: req.body.titulo || "Novo Objetivo",
            descricao: "Clique para editar...",
            tag: "#geral",
            isCompleted: false,
            level: 1,
            subtarefas: [],
            criadoEm: new Date().toISOString()
        };
        await docRef.set(novoObjetivo);
        res.status(201).send(novoObjetivo);
    } catch (error) { res.status(500).send(error.message); }
});

// PUT /api/objetivos/:id - Atualiza o objetivo principal
app.put('/api/objetivos/:id', async (req, res) => {
    try {
        await db.collection('objetivos').doc(req.params.id).update(req.body);
        res.status(200).send({ id: req.params.id, ...req.body });
    } catch (error) { res.status(500).send(error.message); }
});

// GET /api/objetivos/:id/subtarefas
app.get('/api/objetivos/:id/subtarefas', async (req, res) => {
    try {
        const doc = await db.collection('objetivos').doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).send('Objetivo não encontrado');
        }
        // Retorna apenas o array de subtarefas, ou um array vazio se não existir
        res.status(200).send(doc.data().subtarefas || []);
    } catch (error) {
        console.error("Erro ao buscar subtarefas:", error);
        res.status(500).send(error.message);
    }
});

// POST /api/objetivos/:id/subtarefas - Adiciona uma subtarefa
app.post('/api/objetivos/:id/subtarefas', async (req, res) => {
    console.log("\n--- ROTA /subtarefas ACIONADA ---");
    try {
        const objetivoId = req.params.id;
        const { parentId, level, titulo } = req.body;

        // DETETIVE 1: O que o frontend realmente enviou?
        console.log(`ID do Objetivo Principal (da URL): ${objetivoId}`);
        console.log("Dados recebidos no body (req.body):", req.body);

        const objetivoRef = db.collection('objetivos').doc(objetivoId);
        const doc = await objetivoRef.get();

        if (!doc.exists) {
            console.log("!!! ERRO: Documento principal não encontrado no Firestore.");
            return res.status(404).send('Objetivo não encontrado');
        }
        
        const objetivo = doc.data();
        const novaSubtarefa = { id: new Date().getTime().toString(), titulo, isCompleted: false, level: (level || 0) + 1, subtasks: [] };
        
        // DETETIVE 2: Como o objetivo está ANTES da modificação?
        console.log("Objeto ANTES da modificação:", JSON.stringify(objetivo, null, 2));
        
        const objetivoAtualizado = addSubtaskInTree([objetivo], parentId, novaSubtarefa)[0];
        
        // DETETIVE 3: Como o objetivo ficou DEPOIS da modificação?
        console.log("Objeto DEPOIS da modificação:", JSON.stringify(objetivoAtualizado, null, 2));

        // DETETIVE 4: A função recursiva fez alguma mudança?
        if (JSON.stringify(objetivo) === JSON.stringify(objetivoAtualizado)) {
            console.log("!!! ALERTA: A função 'addSubtaskInTree' não modificou o objeto. O 'parentId' pode não ter sido encontrado na árvore de tarefas.");
        }
        
        await objetivoRef.set(objetivoAtualizado);
        console.log("--- SUCESSO: Documento salvo no Firestore. ---");
        res.status(200).send(objetivoAtualizado);

    } catch (error) { 
        console.error("!!! ERRO CRÍTICO NA ROTA:", error);
        res.status(500).send(error.message); 
    }
});

// PUT /api/objetivos/:id/tarefas/:taskId - Atualiza uma tarefa ou subtarefa
app.put('/api/objetivos/:id/tarefas/:taskId', async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const dadosParaAtualizar = req.body;
        const objetivoRef = db.collection('objetivos').doc(id);
        const doc = await objetivoRef.get();
        if (!doc.exists) return res.status(404).send('Objetivo não encontrado');
        
        const objetivo = doc.data();
        const objetivoAtualizado = updateTaskInTree([objetivo], taskId, dadosParaAtualizar)[0];
        
        await objetivoRef.set(objetivoAtualizado);
        res.status(200).send(objetivoAtualizado);
    } catch (error) { res.status(500).send(error.message); }
});

// DELETE /api/objetivos/:id/tarefas/:taskId - Deleta uma tarefa ou subtarefa
app.delete('/api/objetivos/:id/tarefas/:taskId', async (req, res) => {
    try {
        const { id, taskId } = req.params;
        if (id === taskId) {
            await db.collection('objetivos').doc(id).delete();
            return res.status(200).send({ message: `Objetivo ${id} deletado.`});
        }
        
        const objetivoRef = db.collection('objetivos').doc(id);
        const doc = await objetivoRef.get();
        if (!doc.exists) return res.status(404).send('Objetivo não encontrado');
        
        const objetivo = doc.data();
        const objetivoAtualizado = deleteTaskInTree([objetivo], taskId)[0];
        
        await objetivoRef.set(objetivoAtualizado);
        res.status(200).send(objetivoAtualizado);
    } catch (error) { res.status(500).send(error.message); }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});