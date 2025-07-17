// File: client/src/pages/ResetPassword.tsx
// Create this new file.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordCredentials, resetPasswordSchema } from "@shared/schema";
import { useResetPassword } from "@/lib/auth"; // You already created this hook
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { toast } = useToast();
  const params = useParams();
  const [, navigate] = useLocation();
  const resetPassword = useResetPassword();
  const token = params.token || "";

  const form = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
    },
  });

  if (!token) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Invalid Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The password reset link is missing a token. Please request a new one.</p>
                    <Button asChild className="mt-4 w-full">
                        <Link to="/forgot-password">Request New Link</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  const onSubmit = async (data: ResetPasswordCredentials) => {
    try {
      const result = await resetPassword.mutateAsync(data);
      toast({
        title: "Success!",
        description: result.message,
        className: "bg-green-600 text-white",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Your Password - Fourkids</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
              <CardDescription>
                Enter a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetPassword.isPending}
                  >
                    {resetPassword.isPending ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;