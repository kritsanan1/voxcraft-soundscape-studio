import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  type: 'script' | 'dialogue' | 'narration' | 'podcast' | 'story';
  topic: string;
  style: string;
  length: 'short' | 'medium' | 'long';
  audience: string;
  voice_suggestions?: boolean;
  emotional_cues?: boolean;
  pronunciation_guides?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: user } = await supabaseClient.auth.getUser(token);

    if (!user.user) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const requestData: ContentRequest = await req.json();
    const { 
      type, 
      topic, 
      style, 
      length, 
      audience,
      voice_suggestions = true,
      emotional_cues = true,
      pronunciation_guides = false
    } = requestData;

    if (!topic || !type) {
      return new Response('Topic and type are required', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response('OpenAI API key not configured', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Create content generation prompt based on type and parameters
    const lengthMap = {
      short: "100-200 words",
      medium: "300-500 words", 
      long: "600-1000 words"
    };

    const systemPrompt = `You are VoxCraft's AI Content Generator, specialized in creating high-quality ${type} content optimized for text-to-speech conversion. 

Key requirements:
- Generate ${lengthMap[length]} of content
- Target audience: ${audience}
- Style: ${style}
- Topic: ${topic}
- Optimize for voice delivery (clear, flowing sentences)
${voice_suggestions ? '- Include voice/character suggestions in [VOICE: character_name] tags' : ''}
${emotional_cues ? '- Include emotional direction in [EMOTION: feeling] tags' : ''}
${pronunciation_guides ? '- Include pronunciation guides for difficult words in [PRONOUNCE: word = pronunciation] tags' : ''}

Format the response as JSON with:
- content: The main text content
- metadata: Object with voice_suggestions, emotional_cues, estimated_duration, recommended_voices array
- scenes: Array of scene objects if applicable (for scripts/dialogues)
- tips: Array of voice acting tips for delivery`;

    const userPrompt = `Create a ${type} about "${topic}" in ${style} style for ${audience}. Length: ${length}.

Additional context:
- This will be converted to speech using advanced TTS
- Include natural pauses and breathing points
- Make it engaging and suitable for audio consumption`;

    console.log(`Generating ${type} content for user ${user.user.id}: ${topic}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(`Content generation failed: ${errorText}`, { 
        status: response.status, 
        headers: corsHeaders 
      });
    }

    const data = await response.json();
    let generatedContent;
    
    try {
      generatedContent = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      // If JSON parsing fails, return the content as plain text with basic metadata
      generatedContent = {
        content: data.choices[0].message.content,
        metadata: {
          estimated_duration: Math.ceil(data.choices[0].message.content.length / 150), // rough estimate
          recommended_voices: ["Aria", "Sarah", "Roger"],
          voice_suggestions: voice_suggestions,
          emotional_cues: emotional_cues
        },
        scenes: [],
        tips: ["Speak clearly and at a moderate pace", "Use natural pauses for punctuation"]
      };
    }

    // Store the generated content in the database
    const { error: dbError } = await supabaseClient
      .from('audio_projects')
      .insert({
        user_id: user.user.id,
        title: `AI Generated ${type.charAt(0).toUpperCase() + type.slice(1)} - ${topic}`,
        content: generatedContent.content,
        audio_settings: {
          generation_type: type,
          style,
          length,
          audience,
          voice_suggestions,
          emotional_cues,
          pronunciation_guides,
          metadata: generatedContent.metadata
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(JSON.stringify(generatedContent), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error in ai-content-generator function:', error);
    return new Response(`Internal server error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});