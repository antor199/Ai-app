import { createClient } from "@insforge/sdk";

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
});

async function run() {
  const { data, error } = await insforge.database.schema('ai').from('configs').select('model_id').eq('is_active', true);
  if (error) {
    const { data: d2, error: e2 } = await insforge.database.from('ai.configs').select('model_id').eq('is_active', true);
    console.log(d2, e2);
  } else {
    console.log(data);
  }
}

run();
