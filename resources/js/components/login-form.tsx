import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import InputError from "./input-error"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import React from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const {data, setData, post, processing, errors} = useForm ({
    email: '',
    password: '',
  })
  
  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault()
    try {
       post('login')
    } catch (error) {
      toast.error('Login failed. Please try again.')
      }
  }

return (
    <div className={cn("flex flex-col gap-6", className)} >
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Silahkan Login</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
         <form className="grid gap-6" onSubmit={handleSubmit} >
         <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" onChange={(e)=> setData('email', e.target.value)} type="email" placeholder="m@example.com" required />
          <InputError message={errors.email} className="mt-1" />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" onChange={(e)=> setData('password', e.target.value)} type="password" required />
          <InputError message={errors.password} className="mt-1" />
        </div>
          <Button type="submit" className="w-full" disabled={processing}>
            Login
            </Button>
          </form>
     </div>
  )
}
