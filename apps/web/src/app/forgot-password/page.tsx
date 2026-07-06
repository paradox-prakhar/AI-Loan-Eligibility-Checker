import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter the email tied to your FinWise AI account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Email address" type="email" />
          <Button className="w-full">Send reset link</Button>
        </CardContent>
      </Card>
    </main>
  );
}