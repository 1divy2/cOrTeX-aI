import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/workspace/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/workspace/settings"!</div>
}
