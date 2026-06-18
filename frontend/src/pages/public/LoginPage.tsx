import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuthShell } from '@/features/auth/components/AuthShell'
import { FormField } from '@/features/auth/components/FormField'

export function LoginPage() {
  return (
    <AuthShell
      actionHref="/register"
      actionLabel="Register"
      panelClassName="max-w-[556px]"
      subtitle="Log in to track concerns, manage requests, and view appointments."
      title="Welcome Back"
    >
      <Card className="rounded-xl border-0 bg-white py-8 shadow-[0_1px_8px_rgba(15,23,42,0.18)] ring-0">
        <CardContent className="mt-7 space-y-8 px-8 md:px-9">
          <form className="space-y-7">
            <FormField
              label="Email"
              name="email"
              placeholder="juan@email.com"
              required
              type="email"
            />

            <div className="space-y-3">
              <FormField
                label="Password"
                name="password"
                placeholder="password"
                required
                type="password"
              />
              <div className="flex justify-end">
                <Link
                  className="text-base font-medium text-[#d75728] hover:underline"
                  to="/login"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="h-14 w-full rounded-xl bg-[#d75728] text-base font-bold hover:bg-[#c84d23]"
                type="submit"
              >
                Log In
              </Button>
            </div>
          </form>

          <p className="text-center text-base text-slate-500">
            Don&apos;t have an account?{' '}
            <Link className="font-medium text-[#d75728] hover:underline" to="/register">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
