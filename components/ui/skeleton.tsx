import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-[#FFB6D6]/20', className)}
      {...props}
    />
  )
}

export { Skeleton }
