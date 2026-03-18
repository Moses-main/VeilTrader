/**
 * Free AI Gateway
 * 
 * Free alternatives to Bankr for AI analysis
 * Primary: Google Gemini (500 req/day free)
 * Secondary: Groq (free tier)
 * Fallback: Hugging Face Inference
 */

const axios = require('axios');
const logger = require('../utils/logger');

class FreeAIGateway {
  constructor(config) {
    this.config = config;
    this.providers = [];
    this.currentProvider = 0;
    
    // Initialize providers
    if (config.geminiApiKey) {
      this.providers.push({
        name: 'gemini',
        apiKey: config.geminiApiKey,
        baseUrl: 'https://generativelanguage.googleapis.com',
        model: 'gemini-2.0-flash',
        freeTier: '500 req/day'
      });
    }
    
    if (config.groqApiKey) {
      this.providers.push({
        name: 'groq',
        apiKey: config.groqApiKey,
        baseUrl: 'https://api.groq.com/openai/v1',
        model: 'llama-3.3-70b-versatile',
        freeTier: 'Free tier available'
      });
    }
    
    if (config.huggingFaceApiKey) {
      this.providers.push({
        name: 'huggingface',
        apiKey: config.huggingFaceApiKey,
        baseUrl: 'https://api-inference.huggingface.co/models',
        model: 'meta-llama/Llama-3.3-70B-Instruct',
        freeTier: 'Rate limited'
      });
    }
  }

  async analyzePortfolio(portfolio) {
    if (this.providers.length === 0) {
      logger.warn('⚠️ No free AI providers configured');
      return this.getFallbackAnalysis(portfolio);
    }

    const prompt = this.buildAnalysisPrompt(portfolio);
    
    // Try each provider in order
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      try {
        logger.info(`🤖 Trying ${provider.name} for AI analysis...`);
        const result = await this.callProvider(provider, prompt);
        if (result) {
          logger.info(`✅ ${provider.name} analysis received`);
          return result;
        }
      } catch (error) {
        logger.warn(`⚠️ ${provider.name} failed:`, error.message);
      }
    }
    
    // All providers failed, use fallback
    logger.warn('⚠️ All free AI providers failed, using fallback analysis');
    return this.getFallbackAnalysis(portfolio);
  }

  async callProvider(provider, prompt) {
    try {
      switch (provider.name) {
        case 'gemini':
          return await this.callGemini(provider, prompt);
        case 'groq':
          return await this.callGroq(provider, prompt);
        case 'huggingface':
          return await this.callHuggingFace(provider, prompt);
        default:
          return null;
      }
    } catch (error) {
      throw error;
    }
  }

  async callGemini(provider, prompt) {
    const url = `${provider.baseUrl}/v1beta/models/${provider.model}:generateContent?key=${provider.apiKey}`;
    
    const response = await axios.post(url, {
      contents: [{
        parts: [{
          text: `You are a DeFi trading analyst. Analyze this portfolio and respond ONLY with valid JSON:
${prompt}

Respond with this exact JSON format (no other text):
{"sentiment": "bullish|bearish|neutral", "recommendation": "BUY|SELL|HOLD", "confidence": 0.0-1.0, "reasoning": "brief explanation", "riskLevel": "low|medium|high"}`
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000
    });

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    
    return this.parseAnalysis(text);
  }

  async callGroq(provider, prompt) {
    const response = await axios.post(`${provider.baseUrl}/chat/completions`, {
      model: provider.model,
      messages: [{
        role: 'system',
        content: 'You are a DeFi trading analyst. Respond ONLY with valid JSON.'
      }, {
        role: 'user',
        content: `${prompt}\n\nRespond with this exact JSON format (no other text):\n{"sentiment": "bullish|bearish|neutral", "recommendation": "BUY|SELL|HOLD", "confidence": 0.0-1.0, "reasoning": "brief explanation", "riskLevel": "low|medium|high"}`
      }],
      temperature: 0.3,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const text = response.data.choices?.[0]?.message?.content;
    if (!text) return null;
    
    return this.parseAnalysis(text);
  }

  async callHuggingFace(provider, prompt) {
    const response = await axios.post(
      `${provider.baseUrl}/${provider.model}`,
      {
        inputs: `You are a DeFi trading analyst. ${prompt}\n\nRespond with JSON: {"sentiment": "bullish|bearish|neutral", "recommendation": "BUY|SELL|HOLD", "confidence": 0.0-1.0, "reasoning": "brief explanation", "riskLevel": "low|medium|high"}`,
        parameters: {
          temperature: 0.3,
          max_new_tokens: 500
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    const text = response.data?.[0]?.generated_text;
    if (!text) return null;
    
    return this.parseAnalysis(text);
  }

  buildAnalysisPrompt(portfolio) {
    const portfolioText = JSON.stringify(portfolio, null, 2);
    return `Analyze this DeFi portfolio and provide trading recommendations:

Portfolio:
${portfolioText}

Consider:
1. Current asset allocation
2. Market conditions
3. Risk-adjusted returns
4. Diversification

Provide a recommendation for the next action.`;
  }

  parseAnalysis(text) {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;
      
      const data = JSON.parse(jsonMatch[0]);
      
      return {
        sentiment: data.sentiment || 'neutral',
        recommendation: data.recommendation || 'HOLD',
        confidence: Math.min(1, Math.max(0, parseFloat(data.confidence) || 0.5)),
        reasoning: data.reasoning || 'Analysis completed',
        riskLevel: data.riskLevel || 'medium'
      };
    } catch (error) {
      logger.warn('⚠️ Failed to parse AI response:', error.message);
      return null;
    }
  }

  getFallbackAnalysis(portfolio) {
    const totalValue = portfolio.totalValue || 0;
    const ethAllocation = (portfolio.assets || [])
      .filter(a => a.symbol === 'ETH')
      .reduce((sum, a) => sum + a.value, 0);
    
    const ethPercentage = totalValue > 0 ? (ethAllocation / totalValue) * 100 : 50;
    
    // Conservative fallback based on portfolio state
    let sentiment = 'neutral';
    let recommendation = 'HOLD';
    let reasoning = 'Free AI providers unavailable - using conservative fallback';
    let riskLevel = 'medium';
    
    // If heavily allocated to one asset, suggest diversification
    if (ethPercentage > 80) {
      recommendation = 'BUY';
      reasoning = 'Portfolio heavily weighted to ETH - consider diversification';
      riskLevel = 'low';
    } else if (ethPercentage < 20) {
      recommendation = 'BUY';
      reasoning = 'Low ETH allocation - consider accumulating';
      riskLevel = 'medium';
    }
    
    return {
      sentiment,
      recommendation,
      confidence: 0.55, // Slightly above 50% to allow some trades
      reasoning,
      riskLevel
    };
  }

  getProviderInfo() {
    return this.providers.map(p => ({
      name: p.name,
      model: p.model,
      freeTier: p.freeTier
    }));
  }
}

module.exports = FreeAIGateway;
