import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog'

/**
 * AppDialog - Componente base unificado para todos os modais do app
 * Garante padronização visual, spacing, X visível, e comportamento consistente
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
      <DialogContent className={`${sizeClass} w-full p-6 gap-6`} showClose={showClose}>
        {title && (
          <DialogHeader className="border-none p-0">
            <DialogTitle className="text-sm font-medium">{title}</DialogTitle>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
          </DialogHeader>
        )}

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {children}
        </div>

        {footer && (
          <DialogFooter className="flex gap-2 justify-end border-t border-border pt-4 mt-4">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default AppDialog
