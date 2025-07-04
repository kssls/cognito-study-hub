
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { subject, difficulty, count = 5 } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      console.error('OpenAI API key not found in environment variables');
      return new Response(JSON.stringify({ 
        error: 'OpenAI API key not configured. Please add your OpenAI API key to the Supabase Edge Function secrets.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Generating ${count} quiz questions for ${subject} at ${difficulty} level with configured API key`);

    const prompt = `Generate ${count} multiple-choice quiz questions for ${subject} at ${difficulty} difficulty level. 
    
    Return a JSON array of questions with this exact structure:
    [
      {
        "id": "unique_id",
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "subject": "${subject}",
        "difficulty": "${difficulty}",
        "explanation": "Detailed explanation of why the correct answer is right"
      }
    ]
    
    Make sure:
    - Questions are educational and appropriate for the subject
    - Options are plausible but only one is correct
    - Explanations are clear and helpful
    - Use proper academic language
    - Return valid JSON only, no additional text`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an educational content creator that generates high-quality quiz questions. Always return valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content received successfully');
    
    // Parse the JSON response
    let questions;
    try {
      questions = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Raw response:', generatedContent);
      throw new Error('Invalid response format from OpenAI');
    }
    
    if (!Array.isArray(questions)) {
      console.error('OpenAI response is not an array:', questions);
      throw new Error('OpenAI response is not an array');
    }
    
    console.log(`Successfully generated ${questions.length} quiz questions`);
    
    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
