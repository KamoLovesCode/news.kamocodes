import { Article, Weather, ContentBlock, Quote, GalleryImage, StockData } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

// This file has been cleared as per your request.
// The functions below are stubs to prevent the app from crashing.

/**
 * Generates a placeholder image URL. This is a utility function and has been retained.
 */
export const createSolidColorPlaceholderUrl = (dimensions: string): string => {
  const [width, height] = dimensions.split('x');
  const fillColor = '#222222'; // surface-dark color for the theme
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${fillColor}"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

let cachedArticles: Article[] | null = null;

async function getLocalArticles(): Promise<Article[]> {
    if (cachedArticles) {
        return cachedArticles;
    }
    try {
        const response = await fetch('/articles.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch articles.json: ${response.statusText}`);
        }
        const articles: Article[] = await response.json();
        cachedArticles = articles;
        return articles;
    } catch (error) {
        console.error("Error loading local articles:", error);
        return [];
    }
}

export async function fetchNews(): Promise<Article[]> {
  const articles = await getLocalArticles();
  return articles.slice(0, 3);
}

export async function fetchTrendingNews(): Promise<Article[]> {
  const articles = await getLocalArticles();
  return articles;
}

export async function fetchWeather(city: string): Promise<Weather> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const weatherSchema = {
      type: Type.OBJECT,
      properties: {
        current: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            temperature: { type: Type.NUMBER },
            condition: { type: Type.STRING },
            humidity: { type: Type.NUMBER, description: "Humidity in percentage" },
            windSpeed: { type: Type.STRING, description: "Wind speed with units, e.g., '15 km/h'" },
          },
          required: ["city", "temperature", "condition", "humidity", "windSpeed"],
        },
        forecast: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              dayOfWeek: { type: Type.STRING },
              highTemp: { type: Type.NUMBER },
              lowTemp: { type: Type.NUMBER },
              condition: { type: Type.STRING },
            },
            required: ["dayOfWeek", "highTemp", "lowTemp", "condition"],
          },
        },
      },
      required: ["current", "forecast"],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide the current weather and a 5-day forecast for ${city}. Use Celsius. The first forecast day should be 'Today'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: weatherSchema,
      },
    });
    
    const jsonString = response.text.trim();
    const weatherData = JSON.parse(jsonString);

    if (!weatherData.current || !weatherData.forecast || !Array.isArray(weatherData.forecast) || weatherData.forecast.length < 5) {
        console.error("Invalid weather data structure received:", weatherData);
        throw new Error("Received malformed weather data from the AI service.");
    }
    
    return weatherData;

  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    throw new Error(`The weather service is currently unavailable. Please try again later.`);
  }
}

export async function generateImage(prompt: string): Promise<string> {
    // Using a static image service for demo reliability
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(prompt)}`;
}

export async function fetchHowToGuides(): Promise<Article[]> {
    const articles = await getLocalArticles();
    return articles.map(a => ({ ...a, category: 'How-To', id: `howto-${a.id}` }));
}

export async function generateImageGallery(): Promise<GalleryImage[]> {
    const prompts = [
        "a photorealistic image of a futuristic city in South Africa",
        "an oil painting of a lion in a flower field",
        "a vibrant abstract image representing technology",
        "a serene landscape of the drakensberg mountains at sunrise",
        "a minimalist photo of a protea flower",
        "a steampunk-inspired robot reading a newspaper",
        "a watercolor painting of a cape town street scene",
        "a fantasy illustration of a mythical creature in the karoo desert",
    ];
    return prompts.map(prompt => ({
        prompt,
        imageUrl: `https://source.unsplash.com/800x450/?${encodeURIComponent(prompt.split(' ').slice(4).join(' '))}`
    }));
}

export async function fetchDailyQuote(): Promise<Quote> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const quoteSchema = {
            type: Type.OBJECT,
            properties: {
                text: { type: Type.STRING, description: 'The content of the quote.' },
                author: { type: Type.STRING, description: 'The author of the quote.' },
            },
            required: ['text', 'author'],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Provide an inspiring and thought-provoking quote.',
            config: {
                responseMimeType: 'application/json',
                responseSchema: quoteSchema,
            },
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error fetching daily quote:", error);
        // Provide a fallback quote on error
        return { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" };
    }
}

export async function generateCreativeIdea(): Promise<string> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Generate a short, creative idea or prompt. For example, "a story about a lost robot in a forest" or "an app that identifies plants from photos".',
        });
        return response.text;
    } catch (error) {
        console.error("Error generating creative idea:", error);
        return "Could not generate an idea. Please try again.";
    }
}

export async function fetchArticlesForLibrary(): Promise<Article[]> {
    const articles = await getLocalArticles();
    return articles;
}

export async function generateNewsArticle(topic: string): Promise<Article> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const articleSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                fullContent: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, description: 'Can be "paragraph", "subheading", or "quote".' },
                            content: { type: Type.STRING },
                        },
                    },
                },
                category: { type: Type.STRING },
                imageUrl: { type: Type.STRING, description: "A URL for a relevant image from source.unsplash.com, e.g., https://source.unsplash.com/800x600/?topic" },
            },
            required: ['title', 'summary', 'fullContent', 'category', 'imageUrl'],
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Write a news article about the following topic: "${topic}". The article should be balanced and informative. The tone should be like a reputable news source (e.g., Reuters, AP). Include at least one subheading and one quote.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: articleSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const generatedArticleData = JSON.parse(jsonString);

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const groundingUrls = groundingChunks
            ?.map((chunk: any) => chunk.web?.uri)
            .filter((uri: string | undefined): uri is string => !!uri);

        return {
            id: `gen-${Date.now()}`,
            ...generatedArticleData,
            sourceUrl: '#',
            sourceName: 'Generated by AI with Google Search',
            groundingUrls: groundingUrls,
        };
    } catch (error) {
        console.error(`Error generating article for topic "${topic}":`, error);
        throw new Error("The AI journalist is currently unavailable. Please try again later.");
    }
}

export async function* streamNewsUpdates(topic: string): AsyncGenerator<string, void, unknown> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: `Generate a live news feed about the following topic: "${topic}". Provide short, timestamped updates in a continuous stream. Format each update like: "[HH:MM:SS] - Update text..."`,
        });

        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        console.error(`Error streaming news for topic "${topic}":`, error);
        yield "\n--- ERROR: Could not connect to the live feed service. ---";
    }
}

export async function fetchFinancialNews(): Promise<Article[]> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const newsSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    category: { type: Type.STRING },
                    sourceName: { type: Type.STRING },
                    imageUrl: { type: Type.STRING, description: "A URL for a relevant image from source.unsplash.com" },
                },
                required: ['title', 'summary', 'category', 'sourceName', 'imageUrl'],
            }
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Provide the top 5 global financial news stories for today. Focus on market-moving news.',
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: newsSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const generatedArticles = JSON.parse(jsonString);

        return generatedArticles.map((article: any, index: number) => ({
            ...article,
            id: `finance-${Date.now()}-${index}`,
            fullContent: [{ type: 'paragraph', content: article.summary }],
            sourceUrl: '#',
        }));
    } catch (error) {
        console.error("Error fetching financial news:", error);
        throw new Error("Could not load financial news at the moment.");
    }
}

export async function fetchMarketData(): Promise<StockData[]> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const marketSchema = {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    symbol: { type: Type.STRING },
                    name: { type: Type.STRING },
                    price: { type: Type.STRING },
                    change: { type: Type.STRING },
                    changePercent: { type: Type.STRING },
                },
                required: ['symbol', 'name', 'price', 'change', 'changePercent'],
            }
        };
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Get the latest market data for the following indices: Dow Jones Industrial Average (DJIA), NASDAQ Composite (IXIC), S&P 500 (GSPC). Also include one major tech stock like Apple (AAPL). Provide price, change, and percentage change. Prepend '+' to positive changes.",
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: marketSchema,
            },
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error fetching market data:", error);
        throw new Error("Could not load market data at the moment.");
    }
}
