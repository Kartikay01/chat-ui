// supabaseVectorSearch.js

const { createClient } = require('@supabase/supabase-js');
const { OpenAI } = require("openai");

// Function to get embeddings using OpenAI
async function getEmbeddings(query:string) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: openaiApiKey });
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: query,
  });

  return response.data[0].embedding;
}

// Initialize Supabase client
export const getSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

// Search in the vector store
export const searchVectorDB = async (query:string, limit = 8) => {
  const client = getSupabaseClient();
  const embeddings = await getEmbeddings(query);

  // This assumes you have a table or collection in Supabase where you store your embeddings
  const { data, error } = await client.rpc('matchdocuments', {
    query_embedding: embeddings,
    match_count: limit
  });

  if (error) {
    throw new Error(`Error searching vector DB: ${error.message}`);
  }

  return data;
};

