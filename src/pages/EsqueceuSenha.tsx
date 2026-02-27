import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

type Step = 'email' | 'newPassword' | 'done';

export default function EsqueceuSenha() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1: Verify email is active
    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error: dbError } = await supabase
                .from('usuarios')
                .select('id')
                .eq('email', email.toLowerCase().trim())
                .eq('status', 'ativo')
                .maybeSingle();

            if (dbError || !data) {
                setError('E-mail não encontrado ou usuário inativo. Entre em contato com o administrador.');
                return;
            }

            setStep('newPassword');
        } catch {
            setError('Ocorreu um erro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Set new password via Edge Function (no email)
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('As senhas não conferem.');
            return;
        }

        setLoading(true);
        try {
            const { data, error: fnError } = await supabase.functions.invoke('reset-password', {
                body: { email: email.toLowerCase().trim(), newPassword },
            });

            if (fnError) throw new Error(fnError.message);
            if (data?.error) throw new Error(data.error);

            setStep('done');
        } catch (err: any) {
            setError(err.message || 'Falha ao redefinir a senha. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        'w-full px-4 py-3.5 bg-slate-900/60 border rounded-lg outline-none text-white placeholder-slate-500 transition-all text-sm';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative font-sans">
            <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop")',
                }}
            >
                <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full max-w-[440px] p-4">
                <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl p-8 md:p-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="bg-white rounded-2xl flex flex-col items-center justify-center mb-4 shadow-lg shadow-black/20 p-2 overflow-hidden">
                            <img src="/logo.png" alt="TOPAZIO Empreendimentos" className="h-[72px] object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Recuperar Senha</h1>
                        <p className="text-slate-400 text-sm mt-2">
                            {step === 'email' && 'Informe seu e-mail cadastrado'}
                            {step === 'newPassword' && 'Defina sua nova senha'}
                            {step === 'done' && 'Senha atualizada com sucesso!'}
                        </p>
                    </div>

                    {/* STEP 1: Email */}
                    {step === 'email' && (
                        <form onSubmit={handleVerifyEmail} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-1.5">
                                    <Mail size={14} /> E-mail
                                </label>
                                <input
                                    type="email"
                                    className={`${inputBase} border-slate-700/80 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-300 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <><Loader2 size={20} className="animate-spin" /> Verificando...</> : 'Continuar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} /> Voltar ao login
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 2: New Password */}
                    {step === 'newPassword' && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-2 text-sm text-emerald-300">
                                E-mail verificado: <strong>{email}</strong>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-1.5">
                                    <Lock size={14} /> Nova Senha
                                </label>
                                <input
                                    type="password"
                                    className={`${inputBase} border-slate-700/80 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                    placeholder="Mínimo 6 caracteres"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-300 ml-1 flex items-center gap-1.5">
                                    <ShieldCheck size={14} /> Confirmar Nova Senha
                                </label>
                                <input
                                    type="password"
                                    className={`${inputBase} border-slate-700/80 focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
                                    placeholder="Repita a senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-red-300 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <><Loader2 size={20} className="animate-spin" /> Redefinindo...</> : 'Redefinir Senha'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setStep('email'); setError(null); }}
                                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 font-medium py-3.5 rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={18} /> Voltar
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Done */}
                    {step === 'done' && (
                        <div className="space-y-4">
                            <div className="bg-emerald-900/20 border border-emerald-800/40 rounded-lg px-4 py-4 text-sm text-emerald-300 text-center">
                                <ShieldCheck size={32} className="mx-auto mb-2 text-emerald-400" />
                                Senha redefinida com sucesso! Faça login com sua nova senha.
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={18} /> Ir para o Login
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 mt-8 text-center px-4">
                <p className="text-slate-500 text-xs font-medium">
                    © 2026 TOPAZIO Empreendimentos. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
}
