import { StreamingTextResponse, Message, experimental_StreamData, createStreamDataTransformer } from "ai";
import { AIMessage, HumanMessage, SystemMessage } from "langchain/schema";
import { BytesOutputParser } from "langchain/schema/output_parser";
import { searchVectorDB } from "./vector-db";
const { OpenAI } = require("openai");

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const openai = new OpenAI({ apiKey: openaiApiKey });
  const data = new experimental_StreamData();
console.log("MESSAGE",messages)
  // Extract a standalone question to later query the vector db.
  const answer = messages.reduceRight((acc:any, msg) => {
    if (msg.role === "user" && !acc) {
        return msg;
    }
    return acc;
}, null);
  const standaloneQuestion = answer?.content
  console.log("\n====================================");
  console.log("Standalone question:", standaloneQuestion);

  let systemInstructions = "";

  // Get the standalone question and search the vector db.
  const topDocumentsLimit = 10;
  const context:any[] = await searchVectorDB(standaloneQuestion, topDocumentsLimit);
  console.log("CONTEXT",context)
  data.append(JSON.stringify({ context }));
  const contextarray: string[] = context
  .map(item => item.content)
  .filter((content, index) => context[index].similarity > 0.75);
  const contextString:string=contextarray.join(' ');
  console.log("Context String:", contextarray);

  systemInstructions = `You are a knowledgeable and professional chatbot. Help the user by providing detailed and informative answers to their questions.

  Context: ${contextString}
  
  Question: ${standaloneQuestion}
  
  Please ensure your response is thorough, relevant to the context provided, and maintains a professional tone.`;

  // Call and stream the OpenAI API with the instructions, context, and user messages.
  // You need to replace the below logic with the appropriate OpenAI API calls.

 // Call OpenAI API to generate completions
const response= await openai.chat.completions.create({
  model: "gpt-3.5-turbo", // Use your preferred OpenAI model
  messages: [...parseMessages(messages),
    {"role": "user", "content": systemInstructions}],
});

  console.log('Generated response:', response.choices[0].message);
  // Process or return the response as needed

  return new StreamingTextResponse(
    response.choices[0].message.content
  );
}

function parseMessages(messages: Message[]) {
  return messages.map((m, index) => ({
    role: m.role || (index === 0 ? "user" : "assistant"),
    content: m.content,
  }));
}