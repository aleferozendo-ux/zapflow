-- Revoke execute from PUBLIC role on handle_new_user
-- This prevents anon and authenticated roles from executing via RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;