CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT[] DEFAULT '{}',
    age INT NOT NULL CHECK (age >= 13),
    bio TEXT,
    school TEXT,
    email TEXT NOT NULL,
    phone_number TEXT,
    show_email_publicly BOOLEAN DEFAULT FALSE,
    show_phone_number_publicly BOOLEAN DEFAULT FALSE,
    github_link TEXT,
    linkedin_link TEXT,
    instagram_link TEXT,
    facebook_link TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);