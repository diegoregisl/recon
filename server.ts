import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { YoutubeTranscript } from "youtube-transcript";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Safe client lazily checking environment variables
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY is not defined. AI sermon analysis will run in high-quality dynamic simulation mode.");
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey || "MOCK_KEY",
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Route: Analyze Sermon
  app.post("/api/analyze-sermon", async (req, res) => {
    let { text, videoId, vibe } = req.body;
    
    if (!text && !videoId) {
      return res.status(400).json({ error: "Sermon text or videoId is required" });
    }

    try {
      if (videoId) {
        try {
          console.log(`Fetching transcript for videoId: ${videoId}`);
          const transcript = await YoutubeTranscript.fetchTranscript(videoId);
          text = transcript.map(t => t.text).join(" ");
          console.log(`Extracted ${text.length} characters from transcript.`);
        } catch (err: any) {
          console.error("Error fetching transcript:", err.message);
          return res.status(400).json({ error: "Não foi possível extrair a legenda deste vídeo. Verifique se o vídeo possui legendas geradas." });
        }
      }
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.log("Using local mock sermon generator due to empty/placeholder key.");
        return res.json(getMockSermonResponse(text, vibe));
      }

      const client = getGeminiClient();
      const prompt = `Analise a transcrição completa do culto fornecida abaixo.
      A transcrição contém o culto inteiro (abertura, louvores, avisos, orações iniciais e a pregação).
      
      SUA TAREFA:
      1. Faça um resumo cronológico detalhado do culto inteiro. Divida em fases (Abertura, Louvores, Orações, Avisos, Pregação, Apelo/Encerramento). Identifique, se possível, quais músicas foram tocadas, motivos de oração e quem falou.
      2. Depois, isole especificamente o momento da "Pregação/Mensagem" principal (geralmente introduzida pelo pastor) e extraia os materiais teológicos EXCLUSIVAMENTE baseados nessa pregação central (Devocional, Carrossel e Legenda).
      
      O tom de voz deve ser edificante, bíblico, claro, acolhedor e focado em aplicação prática para o dia a dia.
      
      Estilo/Vibe solicitado: ${vibe || "Equilibrado, profundo e prático"}

      Transcrição do Culto:
      """
      ${text}
      """`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Você é o assistente pastoral e diretor de mídia da Igreja Batista Ministério da Reconciliação (RECON).
Sua missão é extrair um cronograma detalhado do culto e focar estritamente na PREGAÇÃO PRINCIPAL para gerar os materiais de rede social.
Você deve retornar exclusivamente um objeto JSON válido, sem qualquer tipo de markdown ou texto adicional ao ao redor do JSON.
O formato exato em JSON deve ser:
{
  "carrossel": [
    {
      "slide_numero": 1,
      "titulo": "Título curto (máx 4 palavras)",
      "texto": "Frase de impacto ou conceito central do sermão"
    }
  ],
  "devocional": {
    "titulo": "Título chamativo para o devocional",
    "versiculo_base": "Referência bíblica principal do sermão",
    "reflexao": "Texto estruturado de exatamente 2 a 3 parágrafos ricos conectando o sermão à vida prática do cristão",
    "oracao_guiada": "Uma oração curta de resposta sincera à palavra"
  },
  "legenda_instagram": "Uma legenda engajadora para o carrossel, incluindo uma pergunta instigante como chamada para ação (CTA) e obrigatoriamente as hashtags #IgrejaRecon #MinisterioDaReconciliacao"
}`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              linha_do_tempo: {
                type: Type.ARRAY,
                description: "Um cronograma resumindo o culto inteiro dividido em fases/partes cronológicas.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fase: { type: Type.STRING, description: "Nome da parte do culto (ex: Abertura, Momento de Louvor, Avisos, Ofertório, Pregação, Apelo, Encerramento)." },
                    descricao: { type: Type.STRING, description: "Resumo rico do que aconteceu nesta fase (cite nomes de louvores reconhecidos no texto, temas das orações, quem pregou, etc)." }
                  },
                  required: ["fase", "descricao"]
                }
              },
              carrossel: {
                type: Type.ARRAY,
                description: "Array of exactly 4 to 6 slides representing progressive theological highlights from the sermon to compose an Instagram post.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    slide_numero: { type: Type.INTEGER },
                    titulo: { type: Type.STRING },
                    texto: { type: Type.STRING }
                  },
                  required: ["slide_numero", "titulo", "texto"]
                }
              },
              devocional: {
                type: Type.OBJECT,
                properties: {
                  titulo: { type: Type.STRING },
                  versiculo_base: { type: Type.STRING },
                  reflexao: { type: Type.STRING },
                  oracao_guiada: { type: Type.STRING }
                },
                required: ["titulo", "versiculo_base", "reflexao", "oracao_guiada"]
              },
              legenda_instagram: { type: Type.STRING }
            },
            required: ["linha_do_tempo", "carrossel", "devocional", "legenda_instagram"]
          }
        }
      });

      const responseText = response.text || "";
      const parsed = JSON.parse(responseText.trim());
      return res.json(parsed);

    } catch (error: any) {
      console.error("Gemini analysis error:", error);
      return res.status(500).json({
        error: "Falha na análise assistida de sermão.",
        details: error?.message || "Erro interno do servidor."
      });
    }
  });

  // Hot module replacement or static server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on standard incoming ingress at http://0.0.0.0:${PORT}`);
  });
}

/**
 * High-quality procedural mock generator in Portuguese when GEMINI_API_KEY is not configured,
 * ensuring seamless user exploration and testing without facing runtime errors.
 */
function getMockSermonResponse(sermonText: string, vibe?: string) {
  const truncatedSample = sermonText.length > 50 ? sermonText.substring(0, 50) + "..." : sermonText;
  const currentVibe = vibe || "Equilibrado, profundo e prático";
  
  // Custom generators based on general keywords in text to feel smart!
  let title = "O Ministério da Reconciliação";
  let verse = "2 Coríntios 5:18";
  let concept1_text = "Fomos reconciliados com Deus por meio de Cristo para herdar uma nova identidade de amor.";
  let concept2_text = "Estender a graça não é ignorar a dor, mas desatar os nós do ressentimento.";
  let concept3_text = "Embaixadores de Cristo: cada palavra e ato nosso deve construir pontes de comunhão.";
  
  const textLower = sermonText.toLowerCase();
  
  if (textLower.includes("fé") || textLower.includes("confian")) {
    title = "Caminhando por Fé Reconciliadora";
    verse = "Hebreus 11:1";
    concept1_text = "A fé inabalável nos dá forças para enfrentar desertos focado na fidelidade de Deus.";
    concept2_text = "Quando a razão duvida, a confiança no caráter de Deus nos mantém firmes no propósito.";
    concept3_text = "Não andamos por vista, mas pela certeza de que Deus está cooperando para o nosso bem.";
  } else if (textLower.includes("amor") || textLower.includes("coração") || textLower.includes("perdo")) {
    title = "A Aliança Perfeita do Amor";
    verse = "Colossenses 3:14";
    concept1_text = "O amor é o vínculo da perfeição que une todas as virtudes em sincera harmonia.";
    concept2_text = "O perdão é a maior expressão de um coração curado pela abundante graça divina.";
    concept3_text = "Exercer compaixão diária é o nosso chamado como filhos amados da luz.";
  } else if (textLower.includes("vida") || textLower.includes("tempestade") || textLower.includes("paz")) {
    title = "Sua Paz na Tempestade";
    verse = "Filipenses 4:7";
    concept1_text = "A verdadeira paz excede os limites da lógica humana e guarda nossa mente.";
    concept2_text = "Quando os ventos rugem lá fora, a âncora da nossa alma está fixa em Cristo.";
    concept3_text = "Aprender a descansar no meio das crises é o maior aprendizado espiritual.";
  }

  return {
    carrossel: [
      {
        slide_numero: 1,
        titulo: "Fundamento Sólido",
        texto: concept1_text
      },
      {
        slide_numero: 2,
        titulo: "Graça Prática",
        texto: concept2_text
      },
      {
        slide_numero: 3,
        titulo: "Caminho de Paz",
        texto: concept3_text
      },
      {
        slide_numero: 4,
        titulo: "Ação de Resposta",
        texto: "Deixe hoje mesmo a palavra de reconciliação de Deus transformar suas atitudes familiares e sociais."
      }
    ],
    devocional: {
      titulo: `Sermão Analisado: ${title}`,
      versiculo_base: `${verse} — "Acima de tudo, revistam-se do amor, que é o vínculo da perfeição."`,
      reflexao: `A palavra compartilhada neste sermão, sob o direcionamento do estilo "${currentVibe}", nos convida a dar passos práticos em direção ao altar de Deus. Às vezes, a rotina esvazia nosso fogo espiritual e nos torna apáticos à dor do outro. Estar sintonizados na reconciliação de Deus significa restabelecer nosso compromisso com a verdade bíblica e o serviço ao próximo de coração limpo.\n\nNas entrelinhas da nossa existência diária, cada conflito resolvido e cada palavra edificante dita representam sementes do Reino de Deus germinando. A reconciliação, portanto, não é uma teoria passiva, mas sim uma decisão corajosa de estender a cruz onde antes havia discórdia. \n\nNo trabalho, em casa ou na vizinhança, somos agentes de paz chamados a traduzir milagres invisíveis em gestos visíveis de acolhimento e escuta ativa. Que a nossa vida seja verdadeiramente a representação física da voz de Jesus curando e reestruturando mentes feridas nesta semana.`,
      oracao_guiada: "Senhor Deus Todo-Poderoso, agradeço pelo Teu ensinamento edificante. Capacita-me a viver de forma justa, a amar a compaixão e a caminhar humildemente diante de Ti. Remove do meu coração todo orgulho para que eu sirva de instrumento vivo de Reconciliação no meu lar e ambiente social. Em nome de Jesus, amém!"
    },
    legenda_instagram: `Um sermão transformador que tocou as profundezas de nosso coração! Vivendo o verdadeiro chamado da reconciliação com sabedoria, responsabilidade e ações inspiradoras diárias. 🕊️⚓\n\nEstilo de leitura pastoral: *${currentVibe}*\n\nDeslize para ver os insights cruciais do sermão de hoje em nosso carrossel exclusivo e guarde essa verdade no seu coração!\n\nQual dessas verdades mais gerou impacto na sua reflexão hoje? Compartilhe nos comentários abaixo!\n\n#IgrejaRecon #MinisterioDaReconciliacao #IgrejaBatista #PalavraDeVida #SermonMetrics #Devocional #Reconciliacao`
  };
}

startServer();
