import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
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
// We'll update this schema in the next section
import { LoginCredentials, loginSchema } from "@shared/schema";
import { useLogin } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const login = useLogin();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    // The identifier field can be email or phone. We will set this up next.
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login.mutateAsync(data);
      toast({
        title: "Login successful",
        description: "Welcome back to Fourkids!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Wholesale Dealer Login - Fourkids</title>
        <meta name="description" content="Access your account to manage your orders." />
      </Helmet>

      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Wholesale Dealer Login</CardTitle>
              <CardDescription>
                Access your account to manage your orders.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    // Name changed to 'identifier' for email/phone
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email or Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@example.com or 1234567890"
                            // Type is "text" to allow phone numbers
                            type="text"
                            autoComplete="username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end text-sm">
                    <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                      Forgot your password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={login.isPending}
                  >
                    {login.isPending ? "Signing in..." : "Login"}
                  </Button>
                </form>
              </Form>

              {/* Separator with text */}
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 flex-shrink text-sm text-muted-foreground">
                  New to Fourkids?
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Outlined Register Button */}
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Register for a new account</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Login;