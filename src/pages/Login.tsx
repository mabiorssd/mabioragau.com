import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthComponent } from "@/components/Auth";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: hasAdminRole } = await supabase
          .rpc('has_role', { _user_id: session.user.id, _role: 'admin' });

        if (hasAdminRole) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return <AuthComponent />;
};

export default Login;