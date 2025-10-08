import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || ""
});

export async function searchIndianLaw(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an expert on Indian law with comprehensive knowledge of the Constitution of India, IPC (Indian Penal Code), CrPC (Code of Criminal Procedure), and all major Indian Acts. 
          
Provide accurate, detailed information about Indian legal provisions. When asked about specific sections, articles, or laws:
1. Give the EXACT title and full text of the provision
2. Explain its meaning in simple terms
3. Mention relevant case laws if applicable
4. Include penalties, jail terms, or consequences if applicable

Be precise and factual. Do not provide generic or vague responses. If you don't have exact information, say so clearly.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content || "No information found.";
  } catch (error: any) {
    console.error("OpenAI Law Search Error:", error);
    throw new Error(error.message || "Failed to search law");
  }
}

export async function getLegalAdvice(query: string, language: string = "en"): Promise<string> {
  try {
    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      ta: "Tamil",
      te: "Telugu",
      bn: "Bengali",
      mr: "Marathi",
      kn: "Kannada",
      gu: "Gujarati",
      or: "Odia",
      ml: "Malayalam",
      pa: "Punjabi"
    };

    const selectedLanguage = languageMap[language] || "English";

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a comprehensive AI legal advisor specializing in Indian law. Respond in ${selectedLanguage}.

Provide detailed legal analysis with this EXACT structure:

**At-a-Glance Summary:**
[Brief 2-3 sentence summary of the legal issue and relevant law]

**Detailed Analysis:**
• Specific Legal Provisions: [List exact IPC sections, CrPC sections, Constitutional Articles, or Act names with their full titles]
• Applicable Laws: [Explain which laws apply and how]
• Rights Available: [What rights does the person have in this situation]
• Penalties/Consequences: [If applicable, mention jail terms, fines, or other penalties with exact provisions]

**Recommended Steps:**
1. [First concrete action to take]
2. [Second step with specific guidance]
3. [Third step or legal remedy available]

Be specific with section numbers, article numbers, and exact legal provisions. Provide accurate information based on current Indian law.`
        },
        {
          role: "user",
          content: query
        }
      ],
      max_completion_tokens: 2048,
    });

    return response.choices[0].message.content || "Unable to provide legal advice at this time.";
  } catch (error: any) {
    console.error("OpenAI Legal Advice Error:", error);
    throw new Error(error.message || "Failed to get legal advice");
  }
}
