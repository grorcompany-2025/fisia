const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por ventana
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, apiKey, model = 'claude-3-5-sonnet-20241022', maxTokens = 4096 } = req.body;

    // Validación
    if (!apiKey) {
      return res.status(400).json({
        error: 'API Key requerida',
        message: 'Debes proporcionar tu API Key de Anthropic'
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: 'Mensajes inválidos',
        message: 'Debes enviar al menos un mensaje'
      });
    }

    // Inicializar cliente de Anthropic con la API key del usuario
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    // Llamada a la API de Claude
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens,
      messages: messages
    });

    // Responder con el resultado
    res.json({
      success: true,
      response: response.content[0].text,
      usage: {
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens
      },
      model: response.model
    });

  } catch (error) {
    console.error('Error en /api/chat:', error);

    // Manejo de errores específicos de Anthropic
    if (error.status === 401) {
      return res.status(401).json({
        error: 'API Key inválida',
        message: 'La API Key proporcionada no es válida. Verifica tu clave en console.anthropic.com'
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Límite de rate excedido',
        message: 'Has excedido el límite de requests. Espera un momento e intenta de nuevo.'
      });
    }

    if (error.status === 400) {
      return res.status(400).json({
        error: 'Petición inválida',
        message: error.message || 'Los parámetros de la petición son inválidos'
      });
    }

    // Error genérico
    res.status(500).json({
      error: 'Error del servidor',
      message: error.message || 'Ocurrió un error procesando tu petición'
    });
  }
});

// Endpoint para listar modelos disponibles
app.get('/api/models', (req, res) => {
  res.json({
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'El modelo más inteligente y equilibrado',
        recommended: true
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        description: 'El modelo más rápido y económico',
        recommended: false
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Modelo potente para tareas complejas',
        recommended: false
      }
    ]
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    message: `La ruta ${req.path} no existe`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 ClaudeWeb Backend running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
});
