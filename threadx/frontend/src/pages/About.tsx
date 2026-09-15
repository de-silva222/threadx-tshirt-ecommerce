import { brandConfig } from '@/config/brand'

export default function About() {
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="section-label mb-3">Our Story</p>
      <h1 className="mb-8 font-display text-4xl uppercase">About {brandConfig.name}</h1>
      <div className="space-y-5 text-sm leading-relaxed text-ink/70">
        <p>{brandConfig.name} started with a simple idea: streetwear should say something. Every design in our catalog — from JDM-inspired graphics to minimal typography — is built on heavyweight cotton and printed to last.</p>
        <p>We print in small, considered batches rather than chasing every trend, and we build every T-shirt around three things: premium fabric, sharp printing, and a fit that actually works for how you dress.</p>
        <p>Based in Sri Lanka, shipping islandwide. If you don't see the print you're after, our Custom T-Shirt Designer lets you build your own from scratch.</p>
      </div>
    </div>
  )
}
