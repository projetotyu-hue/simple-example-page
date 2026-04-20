import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get metrics summary
    const { data: metrics } = await supabaseAdmin
      .from("metrics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    // Get recent logs
    const { data: logs } = await supabaseAdmin
      .from("logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    // Calculate simple stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayMetrics } = await supabaseAdmin
      .from("metrics")
      .select("id")
      .gte("created_at", today.toISOString());

    const stats = {
      totalVisits: todayMetrics?.length || 0,
      uniqueVisitors: new Set(metrics?.map((m) => m.ip)).size,
      devices: {
        mobile: metrics?.filter((m) => m.device === "Mobile").length || 0,
        desktop: metrics?.filter((m) => m.device === "Desktop").length || 0,
        tablet: metrics?.filter((m) => m.device === "Tablet").length || 0,
      },
    };

    return new Response(
      JSON.stringify({ metrics: stats, logs: logs || [] }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});