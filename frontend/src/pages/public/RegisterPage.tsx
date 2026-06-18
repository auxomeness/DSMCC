import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuthShell } from '@/features/auth/components/AuthShell'
import { FormField } from '@/features/auth/components/FormField'

export function RegisterPage() {
  return (
    <AuthShell
      actionHref="/login"
      actionLabel="Login"
      subtitle="Register to submit concerns, request services, and book appointments."
      title="Create Tenant Account"
    >
      <Card className="rounded-lg border-0 bg-white py-6 shadow-[0_1px_5px_rgba(15,23,42,0.18)] ring-0">
        <CardContent className="space-y-5 px-6">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#f6eee9] px-2 py-1 text-xs font-semibold text-[#d75728]">
              <span className="h-1.8 w-1.8 rounded-full bg-[#d75728]" />
              Requires admin approval
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="First Name" name="firstName" placeholder="Juan" required />
              <FormField label="Last Name" name="lastName" placeholder="Dela Cruz" required />
            </div>

            <FormField
              label="Email"
              name="email"
              placeholder="juan@email.com"
              required
              type="email"
            />

              <FormField
                label="Contact Number"
                name="phoneNumber"
                placeholder="09xx xxx xxxx"
                type="tel"
              />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Floor" name="floor" placeholder="e.g. 12" required />

              <FormField
                label="Unit Number"
                name="unitNumber"
                placeholder="e.g. 12B"
                required
              />
            </div>

            <FormField
              label="Password"
              name="password"
              placeholder="password"
              required
              type="password"
            />

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="password"
              required
              type="password"
            />

            <label className="flex items-start gap-2 text-xs leading-5 text-slate-500">
              <input
                className="mt-1 h-3.5 w-3.5 accent-[#d75728]"
                type="checkbox"
              />
              <span>I agree to the Terms of Service and Privacy Policy</span>
            </label>

            <div className="flex justify-center">
              <Button
                className="h-10 rounded-full bg-[#d75728] px-8 text-lg font-bold hover:bg-[#c84d23]"
                type="submit"
              >
                Create Account
              </Button>
            </div>
          </form>

          {/* <div className="flex items-center justify-between gap-2 text-[10px] font-semibold">
            <span className="rounded-md bg-[#f39a3e] px-3 py-2 text-white">
              Pending Approval
            </span>
            <span className="text-slate-400">-&gt;</span>
            <span className="rounded-md bg-[#eeeeef] px-3 py-2 text-slate-500">
              Approved by Admin
            </span>
            <span className="text-slate-400">-&gt;</span>
            <span className="rounded-md bg-[#eeeeef] px-3 py-2 text-slate-500">
              Portal Access
            </span>
          </div> */}

          <p className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link className="font-medium text-[#d75728] hover:underline" to="/login">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthShell>
  )
}
