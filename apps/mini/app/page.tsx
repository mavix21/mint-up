'use client'

import { Button, YStack } from '@my/ui'

export default function Home() {
  return (
    <YStack
      theme="green"
      flex={1}
      justifyContent="center"
      alignItems="center"
      minHeight="100%"
      gap={20}
    >
      <YStack bg="$background">
        <Button>Click me</Button>
      </YStack>
    </YStack>
  )
}
