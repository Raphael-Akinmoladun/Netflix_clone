import AuthForm from '@/components/AuthForm';

export default async function SignupPage({ searchParams }: PageProps<'/signup'>) {
  const { email } = await searchParams;
  return <AuthForm mode="signup" initialEmail={typeof email === 'string' ? email : ''} />;
}
