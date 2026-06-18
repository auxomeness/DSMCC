import { type InputHTMLAttributes } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utils/cn'

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
  required?: boolean
}

export function FormField({
  className,
  label,
  name,
  required,
  ...props
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-xs font-medium text-slate-950">
        {label} {required ? <span className="text-[#d75728]">*</span> : null}
      </Label>
      <Input
        id={name}
        name={name}
        className={cn(
          'h-14 rounded-xl border-slate-300 bg-white px-5 text-base shadow-none placeholder:text-slate-400 focus-visible:border-[#d75728] focus-visible:ring-[#d75728]/20',
          className,
        )}
        {...props}
      />
    </div>
  )
}
