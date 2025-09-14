'use client';
import { verifyEmail } from '@/actions/auth/email-verification';
import Alert from '@/components/common/alert';
import Button from '@/components/common/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Heading from '../common/heading';

const EmailVerificationClient = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, setIsPending] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (!token) {
      return;
    }
    setIsPending(true);
    verifyEmail(token)
      .then((result) => {
        setSuccess(result.success);
        setError(result.error);
      })
      .finally(() => {
        setIsPending(false);
      });
  }, [token]);

  return (
    <div className="border-2 rounded-md flex flex-col gap-2 items-center my-8 max-w-[400px] mx-auto]">
      <Heading title="Next Blog Verification" center />
      {isPending && <div>Loading...</div>}
      {success && <Alert message={success} success />}
      {error && <Alert message={error} error />}
      {success && <Button type="submit" label="Login" onClick={() => router.push('/login')} />}
    </div>
  );
};

export default EmailVerificationClient;
