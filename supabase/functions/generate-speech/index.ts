import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpeechRequest {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  emotion?: string;
  age_factor?: number;
  speed?: number;
  pitch?: number;
  clarity?: number;
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

    const requestData: SpeechRequest = await req.json();
    const { 
      text, 
      voice_id = 'Aria', // Default voice
      model_id = 'eleven_multilingual_v2',
      voice_settings = {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true
      },
      emotion = 'neutral',
      age_factor = 1.0,
      speed = 1.0,
      pitch = 1.0,
      clarity = 1.0
    } = requestData;

    if (!text || text.trim().length === 0) {
      return new Response('Text is required', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      return new Response('ElevenLabs API key not configured', { 
        status: 500, 
        headers: corsHeaders 
      });
    }

    // Voice ID mapping for popular voices
    const voiceMap: Record<string, string> = {
      'Aria': '9BWtsMINqrJLrRacOk9x',
      'Roger': 'CwhRBWXzGAHq8TQ4Fs17',
      'Sarah': 'EXAVITQu4vr4xnSDxMaL',
      'Laura': 'FGY2WhTYpPnrIDTdsKH5',
      'Charlie': 'IKne3meq5aSn9XLyUdCD',
      'George': 'JBFqnCBsd6RMkjVDRZzb',
      'Callum': 'N2lVS1w4EtoT3dr4eOWO',
      'River': 'SAz9YHcvj6GT2YYXdXww',
      'Liam': 'TX3LPaxmHKxFdv7VOQHJ',
      'Charlotte': 'XB0fDUnXU5powFXDhCwa',
      'Alice': 'Xb7hH8MSUJpSbSDYk0k2',
      'Matilda': 'XrExE9yKIg1WjnnlVkGX',
      'Will': 'bIHbv24MWmeRgasZH58o',
      'Jessica': 'cgSgspJ2msm6clMCkdW9',
      'Eric': 'cjVigY5qzO86Huf0OWal',
      'Chris': 'iP95p4xoKVk53GoZ742B',
      'Brian': 'nPczCjzI2devNBz1zQrb',
      'Daniel': 'onwK4e9ZLuTAKqWW03F9',
      'Lily': 'pFZP5JQG7iQjIQuC4Bku',
      'Bill': 'pqHfZKP75CvOlQylNhV4'
    };

    const actualVoiceId = voiceMap[voice_id] || voice_id;

    // Adjust voice settings based on emotion and other parameters
    const adjustedSettings = {
      ...voice_settings,
      stability: Math.max(0, Math.min(1, voice_settings.stability + (emotion === 'excited' ? 0.2 : emotion === 'calm' ? -0.2 : 0))),
      similarity_boost: Math.max(0, Math.min(1, voice_settings.similarity_boost * clarity)),
      style: Math.max(0, Math.min(1, voice_settings.style + (emotion === 'dramatic' ? 0.3 : 0))),
    };

    console.log(`Generating speech for user ${user.user.id} with voice ${voice_id} (${actualVoiceId})`);

    // Call ElevenLabs TTS API
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${actualVoiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: text,
        model_id: model_id,
        voice_settings: adjustedSettings,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      return new Response(`TTS generation failed: ${errorText}`, { 
        status: response.status, 
        headers: corsHeaders 
      });
    }

    const audioBuffer = await response.arrayBuffer();
    
    // Store the generated audio metadata in the database
    const { error: dbError } = await supabaseClient
      .from('audio_projects')
      .insert({
        user_id: user.user.id,
        title: `Generated Speech - ${new Date().toISOString()}`,
        content: text,
        audio_settings: {
          voice_id,
          model_id,
          voice_settings: adjustedSettings,
          emotion,
          age_factor,
          speed,
          pitch,
          clarity
        }
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error in generate-speech function:', error);
    return new Response(`Internal server error: ${error.message}`, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
});