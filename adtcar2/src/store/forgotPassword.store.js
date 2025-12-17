import { create } from "zustand";

export const useForgotPasswordStore = create((set, get) => ({
  step: 1, 
  loading: false,
  form1: { email: "" },
  form2: { email: "", otp: "", newPassword: "", confirmPassword: "" },

  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  set1: (k, v) => set((s) => ({ form1: { ...s.form1, [k]: v } })),
  set2: (k, v) => set((s) => ({ form2: { ...s.form2, [k]: v } })),

  validateEmail: (email) => /^\S+@\S+\.\S+$/.test((email || "").trim()),

  requestOtp: async () => {
    const { form1, validateEmail } = get();
    const email = form1.email.trim();
    if (!email) return alert("Vui lòng nhập email.");
    if (!validateEmail(email)) return alert("Email không hợp lệ.");

    set({ loading: true });
    try {
      

      set((s) => ({ form2: { ...s.form2, email }, step: 2 }));
      alert("✅ (Demo) Đã gửi mã OTP về email. Hãy nhập OTP để đặt lại mật khẩu.");
    } catch (err) {
      console.error(err);
      alert("❌ Gửi OTP thất bại.");
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async () => {
    const { form2 } = get();
    const email = form2.email.trim();
    const otp = form2.otp.trim();
    const newPassword = form2.newPassword;
    const confirmPassword = form2.confirmPassword;

    if (!email) return alert("Thiếu email.");
    if (!otp) return alert("Vui lòng nhập mã OTP.");
    if (!newPassword || newPassword.length < 6) return alert("Mật khẩu mới tối thiểu 6 ký tự.");
    if (newPassword !== confirmPassword) return alert("Mật khẩu xác nhận không khớp.");

    set({ loading: true });
    try {
      

      alert("✅ (Demo) Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.");
    } catch (err) {
      console.error(err);
      alert("❌ Đặt lại mật khẩu thất bại.");
    } finally {
      set({ loading: false });
    }
  },

  backToStep1: () => set({ step: 1 }),
}));
