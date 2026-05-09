INSERT INTO public.user_roles (user_id, role)
VALUES ('a006b75d-8c02-4508-996e-dcb1f3392c92', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;