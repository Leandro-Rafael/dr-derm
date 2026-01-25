import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-akademos-dark via-akademos-medium to-akademos-dark">
      <div className="text-center px-4">
        <h1 className="font-hagrid text-6xl md:text-8xl text-akademos-white mb-4">
          AKADEMOS
        </h1>
        <p className="font-poppins text-2xl text-akademos-cream mb-8">
          A sabedoria a um clique
        </p>
        <Link href="/plataforma">
          <Button variant="secondary" className="text-lg px-8 py-4">
            Conheça a Plataforma
          </Button>
        </Link>
      </div>
    </div>
  )
}
