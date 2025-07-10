'use client'

import { Input, YStack } from '@my/ui'

export default function Home() {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" minHeight="100%" gap={20}>
      <Input placeholder="Enter your name" />
    </YStack>
  )
}
