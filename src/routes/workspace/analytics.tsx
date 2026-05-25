import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/analytics')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/analytics"!</div>
}
