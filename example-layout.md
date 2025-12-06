import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { HeaderUser } from "@/components/dashboard/header-user"
import { DynamicBreadcrumb } from "@/components/dashboard/dynamic-breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LoadingProvider } from "@/components/loading-provider"
import { NavigationProgress } from "@/components/navigation-progress"
import { createClient } from "@/utils/supabase/server"
import { creditService } from "@/lib/credits"
import { redirect } from "next/navigation"
import Script from "next/script"
import ClarityInit from "@/components/ClarityInit"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/login')
  }

  // Fetch user's credit balance for header display
  const { balance: creditBalance } = await creditService.getUserCredits(user.id)
  return (
    <div className="protected-scope">
      <NavigationProgress />
      <ClarityInit projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || ""} userId={user.id} />
      {/* Checkout return tracking script moved here from root layout to scope it to protected pages */}
      <Script id="ga-checkout-return" strategy="afterInteractive">
        {`
          (function(){
            try {
              if (typeof window === 'undefined') return;
              var sid = localStorage.getItem('dodo_last_checkout_session');
              var purchasedSid = localStorage.getItem('dodo_last_purchase_session');
              var payloadStr = localStorage.getItem('dodo_last_checkout_payload');
              if (sid && sid !== purchasedSid && typeof gtag === 'function') {
                fetch('/api/dodopayments/checkout?session_id=' + sid)
                  .then(function(r){ return r.json(); })
                  .then(function(d){
                    var status = d && d.status;
                    var payload = {};
                    try { payload = payloadStr ? JSON.parse(payloadStr) : {}; } catch(_) {}
                    if (status === 'failed') {
                      gtag('event', 'purchase_failed', Object.assign({ session_id: sid }, payload));
                      try {
                        localStorage.removeItem('dodo_last_checkout_session');
                        localStorage.removeItem('dodo_last_checkout_payload');
                      } catch(_) {}
                    } else if (status === 'pending') {
                      gtag('event', 'checkout_abandoned', Object.assign({ session_id: sid }, payload));
                      try {
                        localStorage.removeItem('dodo_last_checkout_session');
                        localStorage.removeItem('dodo_last_checkout_payload');
                      } catch(_) {}
                    } else if (status === 'completed') {
                      try {
                        localStorage.setItem('dodo_last_purchase_session', sid);
                        localStorage.removeItem('dodo_last_checkout_session');
                        localStorage.removeItem('dodo_last_checkout_payload');
                      } catch(_) {}
                    }
                  })
                  .catch(function(_){ /* ignore */ });
              }
            } catch (e) { /* ignore */ }
          })();
        `}
      </Script>
        <SidebarProvider>
          <AppSidebar 
            user={{
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
              email: user.email || '',
              avatar: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
              id: user.id,
            }}
          />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <DynamicBreadcrumb />
              </div>
              <div className="px-4">
                <HeaderUser
                  user={{
                    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email || '',
                    avatar: user.user_metadata?.avatar_url || "/placeholder-user.jpg",
                    id: user.id,
                  }}
                  initialCreditBalance={creditBalance}
                />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              <LoadingProvider>
                {children}
              </LoadingProvider>
            </div>
          </SidebarInset>
        </SidebarProvider>
    </div>
  )
}
