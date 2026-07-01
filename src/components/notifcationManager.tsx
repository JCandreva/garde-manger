'use client'
 
import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from '@/app/actions'
import { Button } from './ui/button'
import i18n from '@/lib/i18n'
 
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
 
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  )
 
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])
 
  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
    const sub = await registration.pushManager.getSubscription()
    setSubscription(sub)
  }
 
  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    })
    setSubscription(sub)
    const serializedSub = JSON.parse(JSON.stringify(sub))
    await subscribeUser(serializedSub)
    await sendNotification(i18n.t('brand.name'), i18n.t('notifications.subscribedBody'))
  }
 
  async function unsubscribeFromPush() {
    await subscription?.unsubscribe()
    setSubscription(null)
    await unsubscribeUser()
  }
 
 
  if (!isSupported) {
    return <p>{i18n.t('notifications.pushSupported')}</p>
  }
 
  return (
    <div>
      <h3>{i18n.t('notifications.pushHeading')}</h3>
      {subscription ? (
        <>
          <p>{i18n.t('notifications.subscribed')}</p>
          <Button onClick={unsubscribeFromPush}>{i18n.t('notifications.unsubscribe')}</Button>
        </>
      ) : (
        <>
          <p>{i18n.t('notifications.unsubscribed')}</p>
          <Button onClick={subscribeToPush}>{i18n.t('notifications.subscribe')}</Button>
        </>
      )}
    </div>
  )
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
 
  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )
 
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])
 
  if (isStandalone) {
    return null // Don't show install button if already installed
  }
 
  return (
    <div>
      <h3>{i18n.t('notifications.installHeading')}</h3>
      <button>{i18n.t('notifications.installButton')}</button>
      {isIOS && (
        <p>{i18n.t('notifications.iosInstall')}</p>
      )}
    </div>
  )
}
 
export default function NotificationManager() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}