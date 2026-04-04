import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nmstrfmxflwgbgkiyeyq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tc3RyZm14Zmx3Z2Jna2l5ZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjU2MTYsImV4cCI6MjA5MDkwMTYxNn0.kaMOwTCuRNlya7sQOzocq5wNC8-bq9ygq-Rf3Gq9Y2s'

export const supabase = createClient(supabaseUrl, supabaseKey)
