import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/assistant')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/assistant"!</div>
}
