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