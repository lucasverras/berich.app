import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

/**
 * AppDialog - Componente base unificado para todos os modais do app
 */
export function AppDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'sm',
  showClose = true,
}) {
  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }[size]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${sizeClass} w-full p-0 gap-0`} showClose={false}>
        {title && (
          <DialogHeader className="border-none px-6 pt-6 pb-4">
            <DialogTitle className="text-base font-semibold text-foreground">{title}</DialogTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </DialogHeader>
        )}

        <div className="px-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {footer && (
          <div className="px-6 pb-6 pt-4 flex gap-2 justify-end">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AppDialog
