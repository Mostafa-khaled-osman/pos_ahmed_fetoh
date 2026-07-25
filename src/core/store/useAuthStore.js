import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase/client';

export const useAuthStore = create(
  persist(
    (set) => ({
      employee: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (username, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.rpc('verify_employee_login', {
            p_username: username.trim(),
            p_password: password,
          });

          if (error) {
            console.error('Login RPC error:', error);
            set({ isLoading: false, error: 'حدث خطأ في الاتصال بالخادم' });
            return false;
          }

          if (!data || data.length === 0) {
            set({ isLoading: false, error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
            return false;
          }

          const user = data[0];
          set({
            employee: user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return true;
        } catch (err) {
          console.error('Unexpected login error:', err);
          set({ isLoading: false, error: 'حدث خطأ غير متوقع' });
          return false;
        }
      },

      logout: () => {
        set({
          employee: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'pos-employee-auth',
      partialize: (state) => ({
        employee: state.employee,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
