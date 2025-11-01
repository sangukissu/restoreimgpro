
-- Create credits table
CREATE TABLE IF NOT EXISTS public.credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    credits_remaining INTEGER DEFAULT 0 NOT NULL,
    total_credits_purchased INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create image_restorations table
CREATE TABLE IF NOT EXISTS public.image_restorations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    original_image_url TEXT NOT NULL,
    restored_image_url TEXT,
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on tables
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_restorations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credits table
CREATE POLICY "Users can view their own credits" ON public.credits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON public.credits
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own credits" ON public.credits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for image_restorations table
CREATE POLICY "Users can view their own restorations" ON public.image_restorations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own restorations" ON public.image_restorations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own restorations" ON public.image_restorations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own restorations" ON public.image_restorations
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically create credits record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.credits (user_id, credits_remaining, total_credits_purchased)
    VALUES (NEW.id, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create credits record for new users
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE TRIGGER update_credits_updated_at
    BEFORE UPDATE ON public.credits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_image_restorations_updated_at
    BEFORE UPDATE ON public.image_restorations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('restored-images', 'restored-images', false)
ON CONFLICT (id) DO NOTHING;

