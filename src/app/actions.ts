'use server'
 
import webpush from 'web-push'
 
webpush.setVapidDetails(
  'mailto:contato@sxigames.me',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)
 
import type { PushSubscription as WebPushSubscription } from 'web-push'

let subscription: WebPushSubscription | null = null

export async function subscribeUser(sub: WebPushSubscription) {
  subscription = sub
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}
 
export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}
 
export async function sendNotification(title:string, message: string) {
  if (!subscription) {
    throw new Error('Nenhuma inscrição disponível')
  }
 
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: '',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Erro ao enviar notificação push:', error)
    return { success: false, error: 'Falha ao enviar notificação' }
  }
}