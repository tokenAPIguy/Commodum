import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://euyjwrmkpdsvexucvrlb.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1eWp3cm1rcGRzdmV4dWN2cmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0Njg3OTQsImV4cCI6MTk4NzA0NDc5NH0.PAiSUzqqHcgVAEMnZjjxIKXL-mgrIUVIg4Z3fB3_IJs";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
