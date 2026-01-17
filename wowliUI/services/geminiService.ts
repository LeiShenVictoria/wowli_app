import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const analyzePhotoForCoaching = async (imageUrl: string, context: string): Promise<any> => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image shared by a mother to her daughter.
            Context: ${context}
            Provide emotional coaching in 3 layers (Chinese):
            1. Sentiment Anchor: What is the mother feeling? (e.g., "妈妈似乎在通过食物表达对你的想念")
            2. Topic Suggestion: What should the daughter talk about? (e.g., "分享你今天也在好好吃饭，这会让她感到无比安心。")
            3. Sample Phrase: A complete reply example.

            Return JSON format with keys: sentiment, topicSuggestion, samplePhrase, stickers (array of emoji strings).`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      sentiment: "妈妈似乎想念你了，在分享她的生活点滴。",
      topicSuggestion: "花点时间注意妈妈在分享什么，回复一些温暖的话语吧。",
      samplePhrase: "妈，看到你那边一切都好我就放心了，我也很想你！",
      stickers: ["❤️", "✨"]
    };
  }
};
