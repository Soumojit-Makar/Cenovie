/**
 * AI-powered enquiry analysis using Groq API
 * Classifies intent, recommends services, assigns priority
 */

const analyzeEnquiry = async (enquiry) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  GROQ_API_KEY not set — skipping AI analysis');
    return null;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        max_tokens: 500,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a business analyst for Digital Indian, a professional GIS and geospatial consulting company. Always return valid JSON only.',
          },
          {
            role: 'user',
            content: `Analyze the following customer enquiry and return a JSON response ONLY (no markdown, no explanation):

Name: ${enquiry.name}
Company: ${enquiry.company || 'Not specified'}
Subject: ${enquiry.subject}
Service Interest: ${enquiry.serviceInterest || 'Not specified'}
Message: ${enquiry.message}

Services we offer: GIS Consulting, Web GIS Solutions, Mobile GIS Solutions, Remote Sensing & Image Analysis, Geospatial Data Engineering, Enterprise GIS Audit, Land Information Systems, Urban Planning GIS Solutions, Utility & Infrastructure Mapping, GeoAI / Spatial Intelligence, Survey Data Digitization

Return ONLY this JSON:
{
  "intent": "brief description of what the customer wants",
  "recommendedService": "most relevant service from our list",
  "priority": "hot|warm|cold",
  "summary": "2-sentence business summary",
  "suggestedReply": "professional 2-3 sentence acknowledgement email body"
}

Priority guide:
- hot = urgent project/tender/large enterprise
- warm = exploring/evaluating
- cold = general info/students/unclear`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    if (!text) {
      throw new Error('Empty response from Groq');
    }

    const insights = JSON.parse(text);
    insights.processedAt = new Date();

    return insights;
  } catch (error) {
    console.error('AI analysis error:', error.message);

    return {
      intent: 'Business enquiry about GIS services',
      recommendedService: enquiry.serviceInterest || 'GIS Consulting',
      priority: 'warm',
      summary: `${enquiry.name} from ${enquiry.company || 'an organization'} has enquired about ${enquiry.subject}.`,
      suggestedReply: `Thank you for reaching out to Digital Indian. We have received your enquiry regarding "${enquiry.subject}" and our GIS experts will review your requirements and respond within 1–2 business days.`,
      processedAt: new Date(),
    };
  }
};

module.exports = { analyzeEnquiry };