export interface FeaturedCardType{
    title: string
    description: string
}

export interface PlanCardProps{
    title: string
    price: string
    description: string
    features: string[]
    buttonText: string
    buttonLink: string
    highlighted?: boolean
}

export interface PricingFeature{
    name: string
    included: boolean
}

export interface PricingCardProps{
    title: string
    price: string
    period?: string
    description: string
    features: PricingFeature[]
    buttonText: string
    buttonLink: string
    highlighted?: boolean
    badge?: string
}