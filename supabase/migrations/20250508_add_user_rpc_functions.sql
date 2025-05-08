
-- Function to get user by email
CREATE OR REPLACE FUNCTION public.get_user_by_email(user_email TEXT)
RETURNS SETOF registered_users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM registered_users
  WHERE email = user_email;
END;
$$;

-- Function to get user by ID
CREATE OR REPLACE FUNCTION public.get_user_by_id(user_id UUID)
RETURNS TABLE(id UUID, first_name TEXT, last_name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ru.id, ru.first_name, ru.last_name
  FROM registered_users ru
  WHERE ru.id = user_id;
END;
$$;

-- Function to update user avatar
CREATE OR REPLACE FUNCTION public.update_user_avatar(user_id UUID, new_avatar_url TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE registered_users
  SET 
    avatar_url = new_avatar_url,
    updated_at = now()
  WHERE id = user_id;
END;
$$;
