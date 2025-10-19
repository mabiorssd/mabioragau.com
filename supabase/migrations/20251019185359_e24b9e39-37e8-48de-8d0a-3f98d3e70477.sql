-- Create visitor analytics table
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_url TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visitor insights table for AI-generated analytics
CREATE TABLE IF NOT EXISTS public.visitor_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis JSONB NOT NULL,
  sample_size INTEGER NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visitor_analytics
CREATE POLICY "Service role can insert visitor analytics"
  ON public.visitor_analytics FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Admins can view visitor analytics"
  ON public.visitor_analytics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for visitor_insights  
CREATE POLICY "Service role can insert visitor insights"
  ON public.visitor_insights FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Admins can view visitor insights"
  ON public.visitor_insights FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for better query performance
CREATE INDEX idx_visitor_analytics_visited_at ON public.visitor_analytics(visited_at DESC);
CREATE INDEX idx_visitor_analytics_page_url ON public.visitor_analytics(page_url);
CREATE INDEX idx_visitor_insights_analyzed_at ON public.visitor_insights(analyzed_at DESC);