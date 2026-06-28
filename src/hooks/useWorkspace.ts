import { useCallback, useEffect, useState } from 'react'
import { loadWorkspace, saveWorkspace, type WorkspaceData } from '@/services/workspace'

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setWorkspace(await loadWorkspace())
    } catch (e) {
      setError(e instanceof Error ? e.message : '读取数据失败')
    } finally {
      setLoading(false)
    }
  }, [])

  const save = useCallback(async (next: WorkspaceData) => {
    setSaving(true)
    setError('')
    try {
      const saved = await saveWorkspace(next)
      setWorkspace(saved)
      return saved
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存失败')
      throw e
    } finally {
      setSaving(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    window.addEventListener('shine-cabin-workspace-updated', refresh)
    return () => window.removeEventListener('shine-cabin-workspace-updated', refresh)
  }, [refresh])

  return { workspace, setWorkspace, loading, saving, error, setError, refresh, save }
}
