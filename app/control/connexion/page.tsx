import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { LoginForm } from '@/components/admin/login-form';
import { GoogleSignInButton } from '@/components/admin/google-button';

export const dynamic = 'force-dynamic';

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "Ce compte Google n'est pas autorisé à accéder à OKKO Control.",
  OAuthAccountNotLinked: 'Ce compte Google est déjà lié à un autre utilisateur.',
  Configuration: 'La connexion Google n’est pas encore configurée.',
};

export default async function ConnexionPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const session = await auth();
  if (session?.user?.id) redirect('/control');
  const { error } = await searchParams;
  const errorMessage = error ? ERROR_MESSAGES[error] ?? 'La connexion a échoué. Réessayez.' : null;
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && !process.env.GOOGLE_CLIENT_ID.startsWith('PLACEHOLDER'));
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.22em] text-[#111111]">
          OKKO <span className="font-normal text-[#999999]">Control</span>
        </p>
        <div className="rounded-[6px] border border-[#E7E7E4] bg-white p-7">
          <h1 className="text-lg font-semibold text-[#111111]">Connexion</h1>
          <p className="mt-1 text-sm text-[#666666]">Accès réservé à l&apos;équipe OKKO Digital.</p>
          {errorMessage ? (
            <p role="alert" className="mt-4 rounded-[4px] border border-[#E7E7E4] bg-[#F7F7F5] px-3 py-2 text-sm text-[#111111]">
              {errorMessage}
            </p>
          ) : null}
          <LoginForm />
          {googleEnabled ? (
            <>
              <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#999999]">
                <span className="h-px flex-1 bg-[#E7E7E4]" />
                ou
                <span className="h-px flex-1 bg-[#E7E7E4]" />
              </div>
              <GoogleSignInButton />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
