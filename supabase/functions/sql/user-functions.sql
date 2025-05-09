
-- Function to create or update user profile
-- Can be called from server-side code with service role
CREATE OR REPLACE FUNCTION public.create_user_profile(
  user_id UUID,
  user_email TEXT,
  first_name TEXT DEFAULT NULL,
  last_name TEXT DEFAULT NULL,
  phone_number TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Executes with privileges of function creator
SET search_path = public
AS $$
DECLARE
  profile_id UUID;
  user_record JSONB;
BEGIN
  -- Check if user already exists
  SELECT id INTO profile_id
  FROM public.registered_users
  WHERE auth_user_id = user_id OR email = user_email
  LIMIT 1;
  
  IF profile_id IS NOT NULL THEN
    -- Update existing user
    UPDATE public.registered_users
    SET 
      auth_user_id = COALESCE(auth_user_id, user_id), -- Keep existing if not null
      email = user_email,
      first_name = COALESCE(create_user_profile.first_name, registered_users.first_name),
      last_name = COALESCE(create_user_profile.last_name, registered_users.last_name),
      phone = COALESCE(create_user_profile.phone_number, registered_users.phone),
      last_sign_in_at = NOW(),
      updated_at = NOW()
    WHERE id = profile_id
    RETURNING to_jsonb(registered_users.*) INTO user_record;
  ELSE
    -- Create new user
    INSERT INTO public.registered_users (
      auth_user_id,
      email,
      first_name,
      last_name,
      phone,
      last_sign_in_at
    ) VALUES (
      user_id,
      user_email,
      first_name,
      last_name,
      phone_number,
      NOW()
    )
    RETURNING to_jsonb(registered_users.*) INTO user_record;
  END IF;
  
  RETURN user_record;
END;
$$;

-- Function to check if user exists by email
CREATE OR REPLACE FUNCTION public.user_exists_by_email(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.registered_users WHERE email = email_to_check
  );
END;
$$;
