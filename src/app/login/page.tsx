import { Label } from '@/components/ui/label'
import { login, signup } from './actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import i18n from '@/lib/i18n'

export default function LoginPage() {
  return (
    <form className="flex flex-col gap-4">
      <div>
      <Label htmlFor="email">{i18n.t('login.email')}</Label>
      <Input id="email" name="email" type="email" required />
      </div>
      <div>
      <Label htmlFor="password">{i18n.t('login.password')}</Label>
      <Input id="password" name="password" type="password" required />
      </div>
      <div className="flex gap-4">
      <Button formAction={login}>{i18n.t('login.signIn')}</Button>
      <Button formAction={signup}>{i18n.t('login.signUp')}</Button>
      </div>
    </form>
  )
}
export const runtime = 'edge';

export const metadata = {
  title: i18n.t('login.title'),
  description: i18n.t('login.description'),
}